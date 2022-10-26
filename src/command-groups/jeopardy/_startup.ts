import { resetChannelStates } from "../../database/tables/discordChannel";

export const jeopardyStartup = async () => {
  await resetChannelStates();
};
