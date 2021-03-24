import { PouchModel } from "pouchorm";

export interface IAuthority {
  name?: string;
}

export class Authority extends PouchModel<Authority> {}
