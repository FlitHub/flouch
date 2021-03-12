import { EntityType } from "@model/entity-type.model";
import { User, IUser } from "@model/user.model";
import { ProcessCouchDbResponse } from "@service/process-response.service";
import { CrudService, ICrudService } from "@service/crud.service";

export interface IUserService extends ICrudService<User> {
  getOneByUserName: (username: string) => Promise<IUser | null>;
}

class UserProcessCouchDbResponse extends ProcessCouchDbResponse<User> {
  constructor() {
    super(User);
  }
}

export class UserService extends CrudService<User> implements IUserService {
  constructor() {
    super(new UserProcessCouchDbResponse(), EntityType.USER);
  }

  /**
   * @param username
   */
  public getOneByUserName(username: string): Promise<User | null> {
    const db = this.dbService.getDatasource();
    const q = {
      selector: {
        username: { $eq: username },
      },
      fields: Object.keys(User),
      limit: 2,
    };
    let user = new User();
    return db
      .find(q)
      .then((res) => {
        user = this.processService.processQueryForOneResponse(res);
        return user;
      })
      .catch((err) => {
        return err;
      });
  }
}