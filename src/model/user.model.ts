import { PouchModel } from "pouchorm";
export class User extends PouchModel<User> {
  username: string;
  password: string;
  lastName: string;
  email: string;
  activated: boolean;
  langKey: string;
  authorities: string[];
}
