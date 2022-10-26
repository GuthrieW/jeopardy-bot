import { SlashCommandBuilder } from "discord.js";

export const generateJeopardyCommands = (): any[] => {
  return [
    new SlashCommandBuilder()
      .setName("jeopardy")
      .setDescription("Jeopardy Bot")
      .addSubcommand((subcommand: any) =>
        subcommand
          .setName("question")
          .setDescription("Play a round of Jeopardy!")
      )
      .addSubcommand((subcommand: any) =>
        subcommand.setName("help").setDescription("Not implemented")
      ),
  ];
};
