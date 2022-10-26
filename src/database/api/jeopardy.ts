import { jeopardy_account } from "../index.d";
import { JeopardyAccount } from "../tables/jeopardyAccount";

export const addUserMoney = async (
  discordId: string,
  moneyToAdd: number
): Promise<number> => {
  const jeopardyAccount: jeopardy_account =
    await JeopardyAccount.findByDiscordIdOrCreate(discordId);

  await JeopardyAccount.updateCorrectAnswer(
    jeopardyAccount?.id as string,
    moneyToAdd
  );

  const { jeopardy_account: updatedAccount } =
    await JeopardyAccount.findByDiscordId(discordId);

  return updatedAccount?.money as number;
};

export const subtractUserMoney = async (
  discordId: string,
  moneyToSubtract: number
): Promise<number> => {
  const jeopardyAccount: jeopardy_account =
    await JeopardyAccount.findByDiscordIdOrCreate(discordId);

  await JeopardyAccount.updateWrongAnswer(
    jeopardyAccount?.id as string,
    moneyToSubtract
  );

  const { jeopardy_account: updatedAccount } =
    await JeopardyAccount.findByDiscordId(discordId);

  return updatedAccount?.money as number;
};
