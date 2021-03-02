import UserService from "@repository/User/UserService";
import { User, IUser } from "@entities/user";
import { Request, Response } from "express";
import { AuthService } from "src/service/auth.service";
import { EntityCouchDbMapper } from "@repository/mapper/entity-mapper";
import logger from "@shared/Logger";

class UserController {
  static userService = new UserService();
  static mapper = new EntityCouchDbMapper<User>();
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    let users;
    try {
      users = await UserController.userService.getAll();
      res.send(users);
    } catch (error) {
      res.status(500).send("Problem getting all users");
    }
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;
    let user: IUser;
    try {
      //We dont want to send the password on response !!!!!!!!!!!!!!
      user = await UserController.userService.getOne(id);
    } catch (error) {
      res.status(404).send("User not found");
    }
    res.send(user);
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let user = new User();
    user = UserController.mapper.toEntity(req.body, user);
    user.password = AuthService.hashPassword(
      user.password ? user.password : "0000"
    );
    const creator =
      res.locals && res.locals.jwtPayload ? res.locals.jwtPayload.username : "";
    //Validade if the parameters are ok
    /*     const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    } */
    //Try to save. If fails, the username is already in use
    try {
      await UserController.userService.add(user, creator);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }
    //If all ok, send 201 response
    res.status(201).send(user);
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const userToSave = UserController.mapper.toEntity(req.body, new User(), [
      "password",
    ]);
    const id = userToSave._id;
    let userFromDb;
    //Try to find user on database
    try {
      userFromDb = await UserController.userService.getOne(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("User not found");
      return;
    }
    userFromDb = UserController.mapper.toEntity(userToSave, userFromDb, [
      "password",
      "createdBy",
      "createdDate",
      "lastModifiedBy",
      "lastModifiedDate",
    ]);
    const creator =
      res.locals && res.locals.jwtPayload ? res.locals.jwtPayload.username : "";
    //Try to safe, if fails, that means username already in use
    try {
      await UserController.userService.update(userFromDb, creator);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    let userFromDb;
    //Try to find user on database
    try {
      userFromDb = await UserController.userService.getOne(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("User not found");
      return;
    }
    try {
      await UserController.userService.delete(userFromDb._id, userFromDb._rev);
    } catch (error) {
      res.status(500).send("Error on delete");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UserController;
