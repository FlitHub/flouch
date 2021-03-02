import { Router } from "express";
import UserController from "@controllers/user.controller";
import { checkJwt } from "@middlewares/check-jwt";
import { checkRole } from "@middlewares/check-role";

const router = Router();

//Get all users
router.get(
  "/users",
  [checkJwt, checkRole(["ROLE_ADMIN"])],
  UserController.listAll
);

// Get one user
router.get(
  "/users/:id([a-zA-Z0-9_]*$)",
  [checkJwt, checkRole(["ROLE_ADMIN"])],
  UserController.getOneById
);

//Create a new user
router.post(
  "/users",
  [checkJwt, checkRole(["ROLE_ADMIN"])],
  UserController.newUser
);

//Edit one user
router.put(
  "/users",
  [checkJwt, checkRole(["ROLE_ADMIN"])],
  UserController.editUser
);

//Delete one user
router.delete(
  "/users/:id([a-zA-Z0-9_]*$)",
  [checkJwt, checkRole(["ROLE_ADMIN"])],
  UserController.deleteUser
);

export default router;
