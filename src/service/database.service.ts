/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Nano from "nano";

export class DatabaseService {
  private dbHost;
  private dbUsername;
  private dbPassword;
  private dbPort;
  private dbName;

  public constructor() {
    this.dbHost = process.env.DB_HOST;
    this.dbUsername = process.env.DB_USERNAME;
    this.dbPassword = process.env.DB_PASSWORD;
    this.dbPort = process.env.DB_PORT;
    this.dbName = process.env.DB_NAME;
  }

  public getNano(): Nano.ServerScope {
    const n = Nano(
      `http://${this.dbUsername}:${this.dbPassword}@${this.dbHost}:${this.dbPort}`
    );
    return n;
  }

  public getDatasource(name?: string) {
    const n = this.getNano();
    return n.db.use(name ? name : this.dbName);
  }

  public getUuid(): Promise<string> {
    const n = this.getNano();
    return n.uuids().then((res) => res.uuids[0].toString());
  }

  public async createIndex(
    fields: string[],
    name: string
  ): Promise<Nano.CreateIndexResponse> {
    const indexDef = {
      index: { fields },
      name,
    };
    return await this.getDatasource().createIndex(indexDef);
  }
}
