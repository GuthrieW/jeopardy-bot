// APIs
export const CLUEBASE_URL = "http://cluebase.lukelav.in";

// Regexes
export const PREPENDED_QUESTION_REGEX =
  /^(what is|what are|whats|what's|where is|where are|wheres|where's|who is|who are|whos|who's|when is|when are|whens|when's|why is|why are|whys|why's) /i;
export const USER_ANSWER_REGEX = /\<.*\>/;
export const ANSWER_PARENTHESES_REGEX = /\(([^)]+)\)/;
export const REPLACE_PARENTHESES_REGEX = /[()]/g;

// Time
export const QUESTION_TIMEOUT = 25000;

// Strings
export const SIMILARITY_THRESHOLD = 0.6;
export const ENGLISH_ARTICLES = ["the", "a", "an"];
