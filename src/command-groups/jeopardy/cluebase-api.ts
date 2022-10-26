import axios from "axios";
import { CLUEBASE_URL } from "./_constants";
import {
  ClueApiResponse,
  ClueData,
  GameApiResponse,
  GameData,
  JeopardyQuestion,
} from "./index.d";

export const getRandomQuestion = async (): Promise<JeopardyQuestion> => {
  const randomClue = await fetchRandomClue();
  const game = await fetchGame(randomClue.game_id);
  const { answer, normalizedAnswer } = sanitizeApiAnswer(randomClue);

  const jeopardyQuestion: JeopardyQuestion = {
    answer,
    normalizedAnswer,
    clue: randomClue.clue,
    value: randomClue.value ?? 200,
    category: randomClue.category,
    airdate: game.air_date,
  };

  return jeopardyQuestion;
};

const fetchRandomClue = async (): Promise<ClueData> => {
  const randomClueResponse: ClueApiResponse = (
    await axios({
      method: "GET",
      url: `${CLUEBASE_URL}/clues/random`,
    })
  ).data;
  const randomClueData: ClueData = randomClueResponse.data[0];
  const { clue, category, response } = randomClueData;

  if (
    !clue ||
    !category ||
    clue == "null" ||
    clue.trim() == "" ||
    clue == "=" ||
    clue.includes("video clue") ||
    clue.includes("audio clue") ||
    clue.includes("seen here") ||
    response.includes("----") ||
    response == "="
  ) {
    console.log("Bad clue", randomClueData);
    return await fetchRandomClue();
  }

  return randomClueData;
};

const fetchGame = async (gameId: number): Promise<GameData> => {
  const gameResponse: GameApiResponse = (
    await axios({
      method: "GET",
      url: `${CLUEBASE_URL}/games/${gameId}`,
    })
  ).data;
  const gameData: GameData = gameResponse.data[0];
  return gameData;
};

const sanitizeApiAnswer = (
  clue: ClueData
): { answer: string; normalizedAnswer: string } => {
  // clean up html elements
  const answer = clue.response.replace(/<(?:.|\n)*?>/gm, "");
  // normalize answer for matching
  const normalizedAnswer = answer.replace(/[^a-zA-Z0-9() ]/g, "").toLowerCase();

  return { answer, normalizedAnswer };
};
