import { AbstractCouchDbEntity } from "src/model/abstract-couchdb.model";

export interface IAuthority {
  name?: string;
}

export class Authority extends AbstractCouchDbEntity implements IAuthority {
  constructor(
    public _id?: string | null,
    public _rev?: string | null,
    public name?: string | null
  ) {
    super();
  }
}
