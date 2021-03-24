#!/usr/bin/env node
import { createDatabasesFromConfig } from "src/init";
require("module-alias/register");
createDatabasesFromConfig();
