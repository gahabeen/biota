export const SIMPLE_SEPARATOR = '_';
export const DOUBLE_SEPARATOR = '__';
export const TS_2500_YEARS = 31556952 * 1000 * 530;
export const PAGINATION_SIZE_MAX = 100000;
export const PAGINATION_SIZE_DEFAULT = 100;
export const SAFE_WAIT_TIME = 65000;
export const DEFAULT_EXPIRATION_DURATION = 3600 * 24;
// export const DOCUMENT_RESERVED_DATA_FIELDS = ['_auth', '_membership', '_activity'];
// export const DOCUMENT_RESERVED_DATA_FIELDS_OBJ = DOCUMENT_RESERVED_DATA_FIELDS.reduce((obj, field) => {
//   Object.assign(obj, { [field]: {} });
//   return obj;
// }, {});

export const FALSE_EXPR = 'BIOTA.FALSE';

export const CONVENTION = {
  ROLE_PREFIX: 'biota.',
  INDEX_PREFIX: 'biota.',
  COLLECTION_PREFIX: 'biota.',
  UDFUNCTION_PREFIX: 'biota.',
};

export const OAUTH2 = {
  GITHUB: {
    AUTHORIZE: 'https://github.com/login/oauth/authorize',
    ACCESS_TOKEN: 'https://github.com/login/oauth/access_token',
    USER_INFO: 'https://api.github.com/user',
    // "TOKEN_INFO": "https://github.com/authorizations/"
  },
  GOOGLE: {
    AUTHORIZE: 'https://accounts.google.com/o/oauth2/v2/auth',
    ACCESS_TOKEN: 'https://www.googleapis.com/oauth2/v4/token',
    TOKEN_INFO: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
    USER_INFO: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
};

export const PATTERNS = {
  TRIM_LEFT: /^\s+/,
  TRIM_RIGHT: /\s+$/,
  ALPHA: /^[a-zA-Z]+$/,
  ALPHANUM: /^[a-zA-Z0-9]+$/,
  ALPHADASH: /^[a-zA-Z0-9_-]+$/,
  EMAIL: /^\S+@\S+\.\S+$/,
  EMAIL_PRECISE: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  MAC: /^((([a-f0-9][a-f0-9]+[-]){5}|([a-f0-9][a-f0-9]+[:]){5})([a-f0-9][a-f0-9])$)|(^([a-f0-9][a-f0-9][a-f0-9][a-f0-9]+[.]){2}([a-f0-9][a-f0-9][a-f0-9][a-f0-9]))$/i,
};

export const TYPE_ERRORS_MESSAGES = {
  required: "The '{field}' field is required.",

  string: "The '{field}' field must be a string.",
  stringEmpty: "The '{field}' field must be empty.",
  stringNonEmpty: "The '{field}' field must be non-empty.",
  stringMin: "The '{field}' field length must be greater than or equal to {expected} characters long.",
  stringMax: "The '{field}' field length must be less than or equal to {expected} characters long.",
  stringLength: "The '{field}' field length must be {expected} characters long.",
  stringPattern: "The '{field}' field fails to match the required pattern.",
  stringContains: "The '{field}' field must contain the '{expected}' text.",
  stringEnum: "The '{field}' field does not match any of the allowed values.",
  stringNumeric: "The '{field}' field must be a numeric string.",
  stringAlpha: "The '{field}' field must be an alphabetic string.",
  stringAlphanum: "The '{field}' field must be an alphanumeric string.",
  stringAlphadash: "The '{field}' field must be an alphadash string.",

  number: "The '{field}' field must be a number.",
  numberMin: "The '{field}' field must be greater than or equal to {expected}.",
  numberMax: "The '{field}' field must be less than or equal to {expected}.",
  numberEqual: "The '{field}' field must be equal to {expected}.",
  numberNonEqual: "The '{field}' field can't be equal to {expected}.",
  numberInteger: "The '{field}' field must be an integer.",
  numberPositive: "The '{field}' field must be a positive number.",
  numberNegative: "The '{field}' field must be a negative number.",

  array: "The '{field}' field must be an array.",
  arrayEmpty: "The '{field}' field must be an empty array.",
  arrayNonEmpty: "The '{field}' field must be a non-empty array.",
  arrayMin: "The '{field}' field must contain at least {expected} items.",
  arrayMax: "The '{field}' field must contain less than or equal to {expected} items.",
  arrayLength: "The '{field}' field must contain {expected} items.",
  arrayContains: "The '{field}' field must contain the '{expected}' item.",
  arrayUnique: "The '{actual}' value in '{field}' field does not unique the '{expected}' values.",
  arrayEnum: "The '{actual}' value in '{field}' field does not match any of the '{expected}' values.",

  boolean: "The '{field}' field must be a boolean.",

  date: "The '{field}' field must be a Date.",
  dateMin: "The '{field}' field must be greater than or equal to {expected}.",
  dateMax: "The '{field}' field must be less than or equal to {expected}.",

  enumValue: "The '{field}' field value '{expected}' does not match any of the allowed values.",

  equalValue: "The '{field}' field value must be equal to '{expected}'.",
  equalField: "The '{field}' field value must be equal to '{expected}' field value.",

  forbidden: "The '{field}' field is forbidden.",

  function: "The '{field}' field must be a function.",

  email: "The '{field}' field must be a valid e-mail.",

  luhn: "The '{field}' field must be a valid checksum luhn.",

  mac: "The '{field}' field must be a valid MAC address.",

  object: "The '{field}' must be an Object.",
  objectStrict: "The object '{field}' contains forbidden keys: '{actual}'.",

  url: "The '{field}' field must be a valid URL.",

  uuid: "The '{field}' field must be a valid UUID.",
  uuidVersion: "The '{field}' field must be a valid UUID version provided.",

  classInstanceOf: "The '{field}' field must be an instance of the '{expected}' class.",
};
