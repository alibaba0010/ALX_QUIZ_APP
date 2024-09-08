import { Router } from "express";

const userRouter = Router();

import UsersController from "../controllers/user.controller";
import { authenticateUser, verifyCreator, verifyUser } from "../utils/auth";

userRouter
  // @desc Register User
  // @route POST /api/v1/users/register
  // @access Public
  .post("/register", UsersController.httpAddNewUser)
  // .post("/creator/register", UsersController.httpAddNewCreator)
  .post("/login", UsersController.httpLogin)
  //update user already  logged in with his token verification
  .patch("/user", authenticateUser, verifyUser, UsersController.updateUser)

  .get("/user", authenticateUser, verifyUser, UsersController.showCurrentUser);

// .get("/logout", authenticateUser, verifyUser, UsersController.logOutUser);

export default userRouter;
