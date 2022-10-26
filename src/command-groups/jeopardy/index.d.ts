export type JeopardyQuestion = {
  answer: string;
  normalizedAnswer: string;
  clue: string;
  value: number;
  category: string;
  airdate: string;
};

export type ClueApiResponse = {
  status: "success" | "failure";
  data: ClueData[];
};

export type ClueData = {
  id: number;
  game_id: number;
  value: number;
  daily_double: boolean;
  round: "J!" | "DJ!";
  category: string;
  clue: string;
  response: string;
};

export type GameApiResponse = {
  status: "success" | "failure";
  data: GameData[];
};

export type GameData = {
  id: number;
  episode_num: number;
  season_id: number;
  air_date: string;
  notes: string;
  contestant1: number;
  contestant2: number;
  contestant3: number;
  winner: number;
  score1: number;
  score2: number;
  score3: number;
};
