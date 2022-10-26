// import { resetChannelStates } from "/database/tables/discordChannel";
import { exit } from "process";
import { resetChannelStates } from "../database/tables/discordChannel";

resetChannelStates().then(() => {
  console.log("done resetting channel states");
  exit(0);
});
