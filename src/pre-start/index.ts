/* eslint-disable @typescript-eslint/restrict-template-expressions */
/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import path from "path";
import dotenv from "dotenv";
import commandLineArgs from "command-line-args";
import { DatabaseService } from "@service/database.service";

(() => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: "development",
      type: String,
    },
  ]);
  // Set the env file
  const result2 = dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
  if (result2.error) {
    throw result2.error;
  }
  // TODO déplacer les fonctions de base de données
  new DatabaseService().createIndex(["type"], "entityTypeIndex");
})();
