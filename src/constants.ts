import * as path from "path";

export const CONFIG_ARG = "--config";
export const NODE_MODULES = path.sep + "node_modules" + path.sep;
export const DEFAULT_JS_PATTERN = "\\.[jt]sx?$";
export const DEFAULT_REPORTER_LABEL = "default";
export const PACKAGE_JSON = "package.json";
export const MPOUCH_CONFIG_BASE_NAME = "pouchdb.config";
export const MPOUCH_CONFIG_ATTR = "pouchdbConfig";
export const MPOUCH_CONFIG_EXT_CJS = ".cjs";
export const MPOUCH_CONFIG_EXT_MJS = ".mjs";
export const MPOUCH_CONFIG_EXT_JS = ".js";
export const MPOUCH_CONFIG_EXT_TS = ".ts";
export const MPOUCH_CONFIG_EXT_JSON = ".json";
export const MPOUCH_CONFIG_EXT_ORDER = Object.freeze([
  MPOUCH_CONFIG_EXT_JS,
  MPOUCH_CONFIG_EXT_TS,
  MPOUCH_CONFIG_EXT_MJS,
  MPOUCH_CONFIG_EXT_CJS,
  MPOUCH_CONFIG_EXT_JSON,
]);
