import { EntityType } from "@entities/entity-type";
import { User, IUser } from "@entities/user";
import { CrudRepository } from "@repository/CrudRepository";
import { ProcessCouchDbResponse } from "@service/process-response.service";

export interface IUserService {
  getOneByUserName: (username: string) => Promise<IUser | null>;
}

class UserProcessCouchDbResponse extends ProcessCouchDbResponse<User> {
  constructor() {
    super(User);
  }
}

class UserService extends CrudRepository<User> implements IUserService {
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

export default UserService;
