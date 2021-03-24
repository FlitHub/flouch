import { toKebabCase } from "@util/functions.util";
import { classToClass } from "class-transformer";
import { PouchORM } from "pouchorm";
import { Database } from "src/database";
import { findDbByName } from "./util/test.util";

const deleteAfterTest = [];

describe("Databases", () => {
  afterAll(async () => {
    deleteAfterTest.forEach(async (dbName) => {
      await PouchORM.deleteDatabase(dbName);
    });
  });
  describe("Get config path", () => {
    it("should create Level database", async () => {
      const dbName = "TestLevelDb";
      const dbToRegister = findDbByName(dbName);
      const dbInfos = await Database.register(dbToRegister);
      deleteAfterTest.push(dbName);
      expect(dbInfos["adapter"]).toEqual("leveldb");
    });

    it("should create local CouchDB database", async () => {
      const dbName = "testLocalCouchAttrAndUrl";
      const dbToRegister = findDbByName(dbName);
      const config = Database.mapConfigurationFromUrl(
        classToClass(dbToRegister)
      );
      const dbInfos = await Database.register(dbToRegister);
      deleteAfterTest.push(config.name);
      expect(toKebabCase(dbName)).toEqual(dbInfos.db_name);
    });
  });
});
