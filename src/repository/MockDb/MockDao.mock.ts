import jsonfile from "jsonfile";
import { IUser, User } from "@entities/user";

interface IDatabase {
  users: User[];
}

class MockDaoMock {
  private readonly dbFilePath = "src/repository/MockDb/MockDb.json";

  protected openDb(): Promise<IDatabase> {
    return jsonfile.readFile(this.dbFilePath) as Promise<IDatabase>;
  }

  protected saveDb(db: IDatabase): Promise<void> {
    return jsonfile.writeFile(this.dbFilePath, db);
  }
}

export default MockDaoMock;
