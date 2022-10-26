import {
  ANSWER_PARENTHESES_REGEX,
  ENGLISH_ARTICLES,
  PREPENDED_QUESTION_REGEX,
  REPLACE_PARENTHESES_REGEX,
  SIMILARITY_THRESHOLD,
  USER_ANSWER_REGEX,
} from "./_constants";
// @ts-ignore
import { compareTwoStrings } from "string-similarity";
import { JeopardyQuestion } from "./index.d";
import { Message } from "discord.js";
import { addUserMoney, subtractUserMoney } from "../../database/api/jeopardy";

export const isQuestionFormat = (userAnswer: string): boolean => {
  const matches = userAnswer
    .replace(/[^\w\s]/i, "")
    .match(PREPENDED_QUESTION_REGEX);
  return Boolean(matches);
};

export const formatQuestion = (question: JeopardyQuestion): string => {
  const questionDate: string = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
  }).format(new Date(question.airdate));

  return `(${questionDate}) The category is **${question.category.toLocaleUpperCase()}** for $${
    question.value
  }:\n\`\`\`${question.clue}\`\`\``;
};

export const evaluateAnswer = async (
  message: Message<boolean>,
  answer: string,
  money: number
): Promise<boolean> => {
  const discordId: string = message.author.id;
  const username: string = message.author.username;
  const content: string = message.content;

  if (!isQuestionFormat(content)) {
    return false;
  }

  const isCorrect: boolean = isCorrectAnswer(content, answer);
  console.log("isCorrect", isCorrect);
  const newMoneyAmount: number = isCorrect
    ? await addUserMoney(discordId, money)
    : await subtractUserMoney(discordId, money);

  console.log("newMoney", newMoneyAmount);
  const formattedMoney: string = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(newMoneyAmount);

  message.reply(
    `That is ${
      isCorrect ? "correct" : "incorrect"
    }, ${username}! Your score is now ${formattedMoney}`
  );

  return isCorrect;
};

const isCorrectAnswer = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  userAnswer = userAnswer
    .toLowerCase()
    .replace(USER_ANSWER_REGEX, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(PREPENDED_QUESTION_REGEX, "")
    .trim();
  correctAnswer = correctAnswer.toLowerCase();

  console.log("userAnswer", userAnswer);
  console.log("correctAnswer", correctAnswer);

  if (ANSWER_PARENTHESES_REGEX.test(correctAnswer)) {
    const matches = ANSWER_PARENTHESES_REGEX.exec(
      correctAnswer
    ) as RegExpExecArray;

    const cleanedMatches = matches.map((match: string) =>
      match.replace(REPLACE_PARENTHESES_REGEX, "")
    );

    if (
      isCorrectAnswer(cleanedMatches[0], correctAnswer) ||
      isCorrectAnswer(cleanedMatches[1], correctAnswer)
    ) {
      return true;
    }
  }

  ENGLISH_ARTICLES.forEach((article: string) => {
    if (userAnswer.indexOf(article + " ") === 0) {
      userAnswer = userAnswer.substring(article.length + 1);
    } else if (userAnswer.indexOf(" " + article + " ") === 0) {
      userAnswer = userAnswer.substring(article.length + 2);
    } else if (correctAnswer.indexOf(article + " ") === 0) {
      correctAnswer = correctAnswer.substring(article.length + 1);
    } else if (correctAnswer.indexOf(" " + article + " ") === 0) {
      correctAnswer = correctAnswer.substring(article.length + 2);
    } else {
      return;
    }

    if (isCorrectAnswer(userAnswer, correctAnswer)) {
      return true;
    }
  });

  return compareTwoStrings(userAnswer, correctAnswer) > SIMILARITY_THRESHOLD;
};
