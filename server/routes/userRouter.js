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
  .get("/", authenticateUser, verifyUser, UsersController.showCurrentUser)
  .get("/quiz", authenticateUser, verifyUser, UsersController.showQuiz)

  .get("/logout", authenticateUser, verifyUser, UsersController.logOutUser)
  .post(
    "/questions",
    authenticateUser,
    verifyUser,
    UsersController.saveQuestions
  )
  // dealing with displaying all questions
  .get("/question", authenticateUser, verifyUser, UsersController.showQuestions)
  .patch(
    "/result",
    authenticateUser,
    verifyUser,
    UsersController.updateUserScore
  )
  // dealing with displaying all questions
  .get("/result", authenticateUser, verifyUser, UsersController.showUserScore);

export default userRouter;
