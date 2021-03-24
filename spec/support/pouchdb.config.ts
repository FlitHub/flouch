import { Configuration, IConfiguration } from "@model/config.model";
import { plainToClass } from "class-transformer";
import * as configuration from "./configuration.json";

const configurationTs: IConfiguration = plainToClass(
  Configuration,
  configuration
);

export default configurationTs;
