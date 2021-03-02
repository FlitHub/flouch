import { IUser, User } from "@entities/user";
import { getRandomInt } from "@shared/functions";
import { IUserService } from "./UserService";
import MockDaoMock from "../MockDb/MockDao.mock";

class UserDao extends MockDaoMock implements IUserService {
  getOneByUserName: (username: string) => Promise<IUser>;
  public async getOne(email: string): Promise<IUser | null> {
    const db = await super.openDb();
    for (const user of db.users) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  public async getAll(): Promise<IUser[]> {
    const db = await super.openDb();
    return db.users;
  }

  public async add(user: User): Promise<void> {
    const db = await super.openDb();
    user._id = String(getRandomInt());
    db.users.push(user);
    await super.saveDb(db);
  }

  public async update(user: User): Promise<void> {
    const db = await super.openDb();
    for (let i = 0; i < db.users.length; i++) {
      if (db.users[i]._id === user._id) {
        db.users[i] = user;
        await super.saveDb(db);
        return;
      }
    }
    throw new Error("User not found");
  }

  public async delete(id: string | number): Promise<void> {
    const db = await super.openDb();
    for (let i = 0; i < db.users.length; i++) {
      if (db.users[i]._id === id) {
        db.users.splice(i, 1);
        await super.saveDb(db);
        return;
      }
    }
    throw new Error("User not found");
  }
}

export default UserDao;
