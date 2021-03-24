import logger from "src/util/logger";
import { Database } from "./database";
import readConfigFileAndSetRootDir from "./read-files/readConfigFileAndSetRootDir";
import resolveConfigPath from "./read-files/resolveConfigPath";

const root = process.cwd();

export const createDatabasesFromConfig = () => {
  const path = getConfigFilePath(root);
  readConfigFileAndSetRootDir(path)
    .then(async (config) => {
      for (const db of config.databases) {
        await Database.register(db);
      }
    })
    .catch((err) =>
      logger.err(`An error occured on database registration,\n${String(err)}`)
    );
};

export const getConfigFilePath = (root: string) => {
  const argv = require("minimist")(process.argv);
  const fileName = argv.config ? String(argv.config) : "";
  return resolveConfigPath(fileName, root);
};
