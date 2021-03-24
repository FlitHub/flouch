import { realpathSync } from "graceful-fs";
import { isAbsolute } from "path";
import type { Config } from "@jest/types";
import { pathToFileURL } from "url";

export function tryRealpath(path: Config.Path): Config.Path {
  try {
    path = realpathSync.native(path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return path;
}

export function interopRequireDefault(obj: any): any {
  return obj && obj.__esModule ? obj : { default: obj };
}

export default async function requireOrImportModule<T>(
  filePath: Config.Path
): Promise<T> {
  let module: T;
  if (!isAbsolute(filePath) && filePath[0] === ".") {
    throw new Error(`Jest: requireOrImportModule path must be absolute`);
  }
  try {
    module = interopRequireDefault(require(filePath)).default;
  } catch (error) {
    if (error.code === "ERR_REQUIRE_ESM") {
      try {
        const configUrl = pathToFileURL(filePath);

        // node `import()` supports URL, but TypeScript doesn't know that
        const importedConfig = await import(configUrl.href);

        if (!importedConfig.default) {
          throw new Error(
            `Jest: Failed to load ESM at ${filePath} - did you use a default export?`
          );
        }

        module = importedConfig.default;
      } catch (innerError) {
        if (innerError.message === "Not supported") {
          throw new Error(
            `Jest: Your version of Node does not support dynamic import - please enable it or use a .cjs file extension for file ${filePath}`
          );
        }
        throw innerError;
      }
    } else {
      throw error;
    }
  }
  return module;
}
