import SQL from "sql-template-strings";
import { query } from "..";
import { jeopardy_account } from "../index.d";

const create = async (
  newJeopardyAccount: jeopardy_account
): Promise<jeopardy_account> => {
  const { discord_id } = newJeopardyAccount;

  const createAccountQuery = SQL`
    INSERT INTO \`jeopardy_account\`
      ( discord_id, correct_answers, wrong_answers, money)
    VALUES
      ( ${discord_id}, 0, 0, 0);
  `;

  const result = await query(createAccountQuery);

  return {
    ...newJeopardyAccount,
    correct_answers: 0,
    wrong_answers: 0,
    money: 0,
  };
};

const findByDiscordIdOrCreate = async (
  discordId: string
): Promise<jeopardy_account> => {
  const existingAccount = await findByDiscordId(discordId);
  if (existingAccount.jeopardy_account) {
    return existingAccount.jeopardy_account;
  }

  await create({
    discord_id: discordId,
  });

  const { jeopardy_account: createdUser } = await findByDiscordId(discordId);

  return createdUser as jeopardy_account;
};

const findById = async (
  jeopardyAccountId: string
): Promise<{
  jeopardy_account: jeopardy_account | null;
  error: string | null;
}> => {
  const getJeopardyAccountQuery = SQL`
    SELECT *
    FROM \`jeopardy_account\`
    WHERE id=${jeopardyAccountId}
  `;

  const result: jeopardy_account[] = await query(getJeopardyAccountQuery);

  if (result.length < 1) {
    return {
      jeopardy_account: null,
      error: `Could not get jeopardy account with id: ${jeopardyAccountId}`,
    };
  }

  return {
    jeopardy_account: result[0],
    error: null,
  };
};

const findByDiscordId = async (
  discordId: string
): Promise<{
  jeopardy_account: jeopardy_account | null;
  error: string | null;
}> => {
  const getJeopardyAccountQuery = SQL`
    SELECT *
    FROM \`jeopardy_account\`
    WHERE discord_id=${discordId}
  `;

  const result: jeopardy_account[] = await query(getJeopardyAccountQuery);

  if (result.length < 1) {
    return {
      jeopardy_account: null,
      error: `Could not get jeopardy account with discord id: ${discordId}`,
    };
  }

  return {
    jeopardy_account: result[0],
    error: null,
  };
};

const updateCorrectAnswer = async (
  id: string,
  moneyToAdd: number
): Promise<boolean> => {
  const updateCorrectAnswerQuery = SQL`
    UPDATE \`jeopardy_account\`
    SET money = money + ${moneyToAdd},
    correct_answers = correct_answers + 1
    WHERE id=${id};
  `;

  const result: jeopardy_account[] = await query(updateCorrectAnswerQuery);
  return true;
};

const updateWrongAnswer = async (
  id: string,
  moneyToSubtract: number
): Promise<boolean> => {
  const updateWrongAnswerQuery = SQL`
    UPDATE \`jeopardy_account\`
    SET money = money - ${moneyToSubtract},
      wrong_answers = wrong_answers + 1
    WHERE id=${id};
  `;

  const result: jeopardy_account[] = await query(updateWrongAnswerQuery);
  return true;
};

export const JeopardyAccount = {
  create,
  findByDiscordIdOrCreate,
  findById,
  findByDiscordId,
  updateCorrectAnswer,
  updateWrongAnswer,
};
