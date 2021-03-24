const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.test\\.ts$": "ts-jest",
  },
  testRegex: "^.+\\.test\\.ts$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testMatch: null,
  moduleDirectories: ["node_modules", "src", "."],
};
