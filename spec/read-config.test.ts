import { Configuration, IConfiguration } from "@model/config.model";
import { plainToClass } from "class-transformer";
import * as path from "path";
import {
  CONFIG_ARG,
  MPOUCH_CONFIG_BASE_NAME,
  MPOUCH_CONFIG_EXT_TS,
  PACKAGE_JSON,
} from "src/constants";
import { getConfigFilePath } from "src/init";
import readConfigFileAndSetRootDir from "src/read-files/readConfigFileAndSetRootDir";
import { addConfigToArg, removeConfigArg } from "./util/test.util";
import * as configuration from "./support/configuration.json";

const configurationTs: IConfiguration = plainToClass(
  Configuration,
  configuration
);

const TEST_CONFIG_FILE = "pouchDBConfig.js";
describe("Read files", () => {
  const outConfigDir = path.join(__dirname, "../../");
  const fakeConfigDir = path.join(__dirname, "fake");
  const configFilesDir = path.join(__dirname, "support");
  const rootDir = path.join(__dirname, ".");
  let configFilePath: string;
  describe("Get config path", () => {
    beforeEach(() => {
      removeConfigArg(CONFIG_ARG);
    });
    it("should get path to file mPouchConfig.js", () => {
      addConfigToArg(TEST_CONFIG_FILE);
      configFilePath = getConfigFilePath(configFilesDir);
      expect(configFilePath.endsWith(TEST_CONFIG_FILE)).toBeTruthy();
    });

    it("should get path to file package.json", () => {
      configFilePath = getConfigFilePath(fakeConfigDir);
      expect(configFilePath.endsWith(PACKAGE_JSON)).toBeTruthy();
    });

    it("should get path to file mpouch.config.ts", () => {
      configFilePath = getConfigFilePath(configFilesDir);
      expect(
        configFilePath.endsWith(MPOUCH_CONFIG_BASE_NAME + MPOUCH_CONFIG_EXT_TS)
      ).toBeTruthy();
    });

    it("should throw error with out project dir", () => {
      expect(() => getConfigFilePath(outConfigDir)).toThrowError();
    });
  });
  describe("Get config", () => {
    it("should get defined config with rootDir in package.json", async () => {
      configFilePath = getConfigFilePath(rootDir);
      const config = await readConfigFileAndSetRootDir(configFilePath);
      expect(config.databases[0].name).toEqual("PackageJsonDb");
      expect(config.rootDir).toEqual(rootDir);
    });

    it("should get defined config in mpouch.config.ts", async () => {
      configFilePath = getConfigFilePath(configFilesDir);
      const config = await readConfigFileAndSetRootDir(configFilePath);
      expect(config.databases.length).toEqual(configurationTs.databases.length);
    });

    it("should get defined config in mPouchConfig.js", async () => {
      addConfigToArg(TEST_CONFIG_FILE);
      configFilePath = getConfigFilePath(configFilesDir);
      const config = await readConfigFileAndSetRootDir(configFilePath);
      expect(config.databases.length).toEqual(configurationTs.databases.length);
    });
  });
});
