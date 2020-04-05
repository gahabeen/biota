export const SIMPLE_SEPARATOR = "_";
export const DOUBLE_SEPARATOR = "__";
export const TS_2500_YEARS = 31556952 * 1000 * 530;
export const PAGINATION_SIZE_MAX = 100000;
export const SAFE_WAIT_TIME = 65000;

export const CONVENTION = {
  ROLE_PREFIX: "biota.",
  INDEX_PREFIX: "biota.",
  COLLECTION_PREFIX: "biota.",
  UDFUNCTION_PREFIX: "biota.",
};

export const OAUTH2 = {
  GITHUB: {
    AUTHORIZE: "https://github.com/login/oauth/authorize",
    ACCESS_TOKEN: "https://github.com/login/oauth/access_token",
    USER_INFO: "https://api.github.com/user",
    // "TOKEN_INFO": "https://github.com/authorizations/"
  },
  GOOGLE: {
    AUTHORIZE: "https://accounts.google.com/o/oauth2/v2/auth",
    ACCESS_TOKEN: "https://www.googleapis.com/oauth2/v4/token",
    TOKEN_INFO: "https://www.googleapis.com/oauth2/v3/tokeninfo",
    USER_INFO: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
};
