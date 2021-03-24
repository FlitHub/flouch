import { Configuration, IConfiguration } from "@model/config.model";
import { plainToClass } from "class-transformer";
import { CONFIG_ARG } from "src/constants";
import * as configuration from "../support/configuration.json";

const configurationTs: IConfiguration = plainToClass(
  Configuration,
  configuration
);

export const addConfigToArg = (value: string) => {
  process.argv.push(CONFIG_ARG, value);
};

export const removeConfigArg = (arg: string) => {
  const iConfig = process.argv.indexOf(arg);
  if (iConfig > -1) {
    process.argv.splice(iConfig, 2);
  }
};

export const findDb = (attr: string, value: string) => {
  return configurationTs.databases.find((db) => db[attr] === value);
};

export const findDbByName = (name: string) => {
  return findDb("name", name);
};
