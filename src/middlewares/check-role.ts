import { Request, Response, NextFunction } from "express";
import { User } from "@entities/user";
import UserService from "@repository/User/UserService";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = new UserService();
    let user: User;
    try {
      user = await userRepository.getOne(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    let authorized = false;
    if (user.authorities) {
      for (const authority of user.authorities) {
        if (roles.indexOf(authority) > -1) {
          authorized = true;
          next();
        }
      }
    }
    if (!authorized) {
      res.status(401).send();
    }
  };
};
