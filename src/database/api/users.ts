import { discord_user } from "../index.d";
import { DiscordUser } from "../tables/discordUser";

type NewDiscordUser = {
  discordId: string;
  username: string;
};

export const addUser = async ({
  discordId,
  username,
}: NewDiscordUser): Promise<{
  newUser: discord_user | null;
  error: string | null;
}> => {
  if (!discordId) {
    return { newUser: null, error: "INVALID_DISCORD_ID" };
  }

  if (!username) {
    return { newUser: null, error: "INVALID_USERNAME" };
  }

  const newUser: discord_user = await DiscordUser.create(discordId);

  return {
    newUser,
    error: newUser
      ? null
      : `Could not create new user moment with data: ${JSON.stringify({
          discordId,
        })}`,
  };
};
