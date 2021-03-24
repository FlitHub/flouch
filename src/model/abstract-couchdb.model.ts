import { PouchModel } from "pouchorm";
export abstract class MPouchModel<T> extends PouchModel<T> {
  public createdBy?: string;
  public createdDate?: Date;
  public lastModifiedBy?: string;
  public lastModifiedDate?: Date;
}
