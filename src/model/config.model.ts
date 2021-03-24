import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
} from "class-validator";

export enum POUCH_DB_TYPE {
  HTTP,
  LEVEL,
  INDEXED,
  WEBSQL,
}

export interface IDatabaseConfiguration {
  id?: string;
  name?: string;
  url?: string;
  protocol?: string;
  hostname?: string;
  port?: string | number;
  username?: string;
  password?: string;
  type?: POUCH_DB_TYPE;
}

export class DatabaseConfiguration implements IDatabaseConfiguration {
  @IsString()
  id?: string;
  @IsNotEmpty()
  @IsString()
  name?: string;
  @ValidateIf((o: IDatabaseConfiguration) => o.type === POUCH_DB_TYPE.HTTP)
  @IsNotEmpty()
  @IsUrl()
  url?: string;
  @IsString()
  protocol?: string;
  @ValidateIf((o: IDatabaseConfiguration) => o.type === POUCH_DB_TYPE.HTTP)
  @IsNotEmpty()
  @IsString()
  hostname?: string;
  @IsString()
  port?: string | number;
  @IsString()
  username?: string;
  @IsString()
  password?: string;
  @IsDefined()
  type?: POUCH_DB_TYPE;
}

export interface IConfiguration {
  log?: boolean;
  rootDir?: string;
  databases?: IDatabaseConfiguration[];
}

export class Configuration implements IConfiguration {}
