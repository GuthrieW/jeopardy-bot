import { generateJeopardyCommands } from "../command-groups/jeopardy/_commands";

const { REST, Routes } = require("discord.js");
require("dotenv").config();

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

const commands = generateCommands();
resetGuildCommands(rest);
deployGuildCommands(rest, commands);

function generateCommands(): any[] {
  const commands = [];
  commands.push(...generateJeopardyCommands());
  return commands.map((command) => command.toJSON());
}

function resetGuildCommands(rest: any) {
  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: [] }
    )
    .then(() => console.log("Successfully deleted all guild commands."))
    .catch(console.error);
}

function deployGuildCommands(rest: any, newCommands: any[]) {
  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: newCommands }
    )
    .then(() => console.log(`Successfully registered application commands.`))
    .catch(console.error);
}
