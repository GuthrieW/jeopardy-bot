export type discord_channel = {
  id?: string;
  channel_id?: string;
  channel_state?: 0 | 1;
};

export type discord_user = {
  id?: string;
  discord_id?: string;
  username?: string;
};

export type jeopardy_account = {
  id?: string;
  discord_id?: string;
  correct_answers?: number;
  wrong_answers?: number;
  money?: number;
};
