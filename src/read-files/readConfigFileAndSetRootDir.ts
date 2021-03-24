import type { Config } from "@jest/types";
import { IConfiguration, IDatabaseConfiguration } from "@model/config.model";
import { serialize } from "class-transformer";
import * as jsonlint from "jsonlint";
import * as path from "path";
import requireOrImportModule, {
  interopRequireDefault,
} from "src/util/files.util";
import type { Service } from "ts-node";
import {
  MPOUCH_CONFIG_ATTR,
  MPOUCH_CONFIG_EXT_JSON,
  MPOUCH_CONFIG_EXT_TS,
  PACKAGE_JSON,
} from "../constants";

// Read the configuration and set its `rootDir`
// 1. If it's a `package.json` file, we look into its "jest" property
// 2. If it's a `mpouch.config.ts` file, we use `ts-node` to transpile & require it
// 3. For any other file, we just require it. If we receive an 'ERR_REQUIRE_ESM'
//    from node, perform a dynamic import instead.
export default async function readConfigFileAndSetRootDir(
  configPath: Config.Path
): Promise<IConfiguration> {
  const isTS = configPath.endsWith(MPOUCH_CONFIG_EXT_TS);
  const isJSON = configPath.endsWith(MPOUCH_CONFIG_EXT_JSON);
  let configObject;

  try {
    if (isTS) {
      configObject = await loadTSConfigFile(configPath);
    } else if (isJSON) {
      const jsonConfig = serialize(require(configPath));
      configObject = jsonlint.parse(jsonConfig);
    } else {
      configObject = await requireOrImportModule<any>(configPath);
    }
  } catch (error) {
    if (isJSON) {
      throw new Error(
        `PouchConfig: Failed to parse config file ${configPath}\n` +
          `  ${String(error)}`
      );
    } else if (isTS) {
      throw new Error(
        `PouchConfig: Failed to parse the TypeScript config file ${configPath}\n` +
          `  ${String(error)}`
      );
    } else {
      throw error;
    }
  }

  if (configPath.endsWith(PACKAGE_JSON)) {
    // Event if there's no "jest" property in package.json we will still use
    // an empty object.
    configObject = configObject[MPOUCH_CONFIG_ATTR] || {};
  }

  if (configObject.rootDir) {
    // We don't touch it if it has an absolute path specified
    if (!path.isAbsolute(configObject.rootDir)) {
      // otherwise, we'll resolve it relative to the file's __dirname
      configObject.rootDir = path.resolve(
        path.dirname(configPath),
        configObject.rootDir
      );
    }
  } else {
    // If rootDir is not there, we'll set it to this file's __dirname
    configObject.rootDir = path.dirname(configPath);
  }

  return configObject;
}

// Load the TypeScript configuration
const loadTSConfigFile = async (
  configPath: Config.Path
): Promise<IDatabaseConfiguration> => {
  let registerer: Service;

  // Register TypeScript compiler instance
  try {
    registerer = require("ts-node").register({
      compilerOptions: {
        module: "CommonJS",
      },
    });
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      throw new Error(
        `PouchConfig: 'ts-node' is required for the TypeScript configuration files. Make sure it is installed\nError: ${String(
          e.message
        )}`
      );
    }

    throw e;
  }

  registerer.enabled(true);

  let configObject = interopRequireDefault(require(configPath)).default;

  // In case the config is a function which imports more Typescript code
  if (typeof configObject === "function") {
    configObject = await configObject();
  }

  registerer.enabled(false);

  return configObject;
};
