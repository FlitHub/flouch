import {
  DatabaseConfiguration,
  IDatabaseConfiguration,
  POUCH_DB_TYPE,
} from "@model/config.model";
import { toKebabCase } from "@util/functions.util";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { PouchORM } from "pouchorm";
import logger from "src/util/logger";
import { URL } from "url";

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gm;

export class Database {
  configuration: DatabaseConfiguration;
  local = false;
  isCouchDb = false;

  static register(
    config: IDatabaseConfiguration
  ): Promise<PouchDB.Core.DatabaseInfo> {
    const configuration = plainToClass(DatabaseConfiguration, config);
    if (Database.isValidUrl(configuration.url)) {
      Database.mapConfigurationFromUrl(configuration);
    } else if (configuration.type === POUCH_DB_TYPE.HTTP) {
      Database.mapUrlFromConfiguration(configuration);
    }
    validateOrReject(configuration).catch((errors: any[]) =>
      errors.forEach((err) => logger.err(err, true))
    );
    const name = configuration.name;
    const db = <PouchDB.Database<{}>>PouchORM.getDatabase(name);
    return db.info();
  }

  static mapConfigurationFromUrl(
    configuration: DatabaseConfiguration
  ): DatabaseConfiguration {
    const parsedUrl = new URL(configuration.url);
    Database.preferConfigValue("hostname", configuration, parsedUrl);
    Database.preferConfigValue("username", configuration, parsedUrl);
    Database.preferConfigValue("password", configuration, parsedUrl);
    Database.preferConfigValue("port", configuration, parsedUrl);
    configuration.port = String(configuration.port);
    parsedUrl.port = configuration.port;
    configuration.name = configuration.name
      ? configuration.name
      : parsedUrl.pathname.split("/")[1];
    configuration.name = toKebabCase(configuration.name);
    parsedUrl.pathname = configuration.name;
    configuration.url = parsedUrl.toString();
    configuration.name = configuration.url;
    configuration.protocol = parsedUrl.protocol;
    configuration.id = configuration.id ? configuration.id : configuration.name;
    return configuration;
  }

  static preferConfigValue(
    attr: string,
    configuration: DatabaseConfiguration,
    url: URL
  ) {
    configuration[attr] =
      attr && configuration[attr] ? configuration[attr] : url[attr];
  }

  static mapUrlFromConfiguration(configuration: IDatabaseConfiguration) {
    configuration.url = Database.getUrlFromConfiguration(configuration);
  }

  static isValidUrl(url: string) {
    if (!url) return false;
    return url && new RegExp(urlRegex).exec(url);
  }

  static getUrlFromConfiguration(
    configuration: IDatabaseConfiguration
  ): string {
    const protocol = configuration.type
      ? String(configuration.type).toLowerCase()
      : "http";
    return `${protocol}://${configuration.username}:${configuration.password}@${
      configuration.hostname
    }${configuration.port ? ":" + String(configuration.port) : ""}/${
      configuration.name
    }`;
  }

  public async createIndex(fields: string[], name: string): Promise<any> {
    const indexDef = {
      index: { fields },
      name,
    };
    return Promise.resolve(null); //await this.getDatasource().createIndex(indexDef);
  }
}
