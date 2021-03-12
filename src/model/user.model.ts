import { AbstractCouchDbEntity } from "src/model/abstract-couchdb.model";
import Nano from "nano";
import { EntityType } from "./entity-type.model";

export interface IUser extends Nano.MaybeDocument {
  username?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  type: EntityType;
}

export class User extends AbstractCouchDbEntity implements IUser {
  constructor(
    public _id?: string | null,
    public _rev?: string | null,
    public username?: string | null,
    public password?: string | null,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string,
    public activated?: boolean,
    public langKey?: string,
    public authorities?: string[],
  ) {
    super();
  }
}

export class Account extends AbstractCouchDbEntity {
  constructor(
    public _id?: string | null,
    public _rev?: string | null,
    public activated?: boolean,
    public authorities?: string[],
    public email?: string,
    public firstName?: string | null,
    public langKey?: string,
    public lastName?: string | null,
    public username?: string,
    public imageUrl?: string | null
  ) {
    super();
  }
}
