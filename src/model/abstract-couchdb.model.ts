import { toSnakeCase } from "@shared/functions";
import Nano from "nano";
import { EntityType } from "./entity-type.model";

export interface IAbstractCouchDbEntity extends Nano.MaybeDocument {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  type: EntityType;
}

export abstract class AbstractCouchDbEntity implements IAbstractCouchDbEntity {
  _id?: string;
  _rev?: string;
  type: EntityType;

  constructor(
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {
    const strType = toSnakeCase(
      this.constructor.name
    ).toUpperCase() as keyof typeof EntityType;
    this.type = EntityType[strType];
  }
}
