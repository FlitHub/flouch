import UserService from "@repository/User/UserService";
import config from "@shared/config";
import logger from "@shared/Logger";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AuthService } from "src/service/auth.service";
import { AuthoritiesRepository } from "@repository/Authorities/AuthoritiesRepository";
import { Authority } from "@entities/authority";
import { User, Account } from "@entities/user";
import { AccountService } from "@repository/User/AccountService";

type JwtToken = {
  id_token: string;
};

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
      return;
    }
    //Get user from database
    const userRepository = new UserService();
    let user: User | null;
    let token: JwtToken;
    try {
      user = await userRepository.getOneByUserName(username);
      //Check if encrypted password match
      if (
        !user ||
        !user.password ||
        !AuthService.checkIfUnencryptedPasswordIsValid(password, user.password)
      ) {
        res.status(401).send();
        return;
      }
      //Sing JWT, valid for 1 hour
      user.password = null;
      token = {
        id_token: jwt.sign(
          { userId: user._id, username: user.username },
          config.jwtSecret,
          { expiresIn: "1h" }
        ),
      };
    } catch (error) {
      logger.err(error);
      res.status(401).send();
    }

    //Send the jwt in the response
    res.send(token);
  };

  static account = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = res.locals.jwtPayload.userId;
    //Get the user from database
    const accountService = new AccountService();
    let account: Account;
    try {
      //We dont want to send the password on response !!!!!!!!!!!!!!
      account = await accountService.getOne(id);
    } catch (error) {
      res.status(404).send("Account not found");
    }
    res.send(account);
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = new UserService();
    let user: User;
    try {
      user = await userRepository.getOne(id);
      //Check if old password matchs
      if (
        !user.password ||
        !AuthService.checkIfUnencryptedPasswordIsValid(
          oldPassword,
          user.password
        )
      ) {
        res.status(401).send();
        return;
      }

      //Validate de model (password lenght)
      user.password = newPassword;
      /*       const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      } */
      //Hash the new password and save
      AuthService.hashPassword(newPassword);
      userRepository.update(user);
    } catch (id) {
      res.status(401).send();
    }

    res.status(204).send();
  };

  static authorities = async (req: Request, res: Response) => {
    const authoritiesRepository = new AuthoritiesRepository();
    const authorities: Authority[] = await authoritiesRepository.getAll();
    const result = authorities ? authorities.map((a) => a.name) : [];
    res.send(result);
  };
}

export default AuthController;
