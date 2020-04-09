require("dotenv").config();

module.exports = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  roots: ["<rootDir>/tests/"],
  moduleNameMapper: {
    "~/(.*)$": "<rootDir>/src/$1",
  },
  // moduleFileExtensions: ["js", "d.ts", "ts"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
};
