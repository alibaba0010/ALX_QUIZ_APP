import { Router } from "express";
import UsersController from "../controllers/user.controller";
import { authenticateUser, verifyUser } from "../utils/auth";

const userRouter = Router();

userRouter
  .post("/register", UsersController.httpAddNewUser)
  .post("/login", UsersController.httpLogin)
  .get("/", authenticateUser, verifyUser, UsersController.showCurrentUser)
  .get("/quiz", authenticateUser, verifyUser, UsersController.showQuiz)
  .get("/logout", authenticateUser, verifyUser, UsersController.logOutUser)
  .post("/google/register", UsersController.registerGoogleUser)
  .post("/google/login", UsersController.loginGoogleUser)
  .post(
    "/questions",
    authenticateUser,
    verifyUser,
    UsersController.saveQuestions
  )
  .get("/question", authenticateUser, verifyUser, UsersController.showQuestions)
  .patch(
    "/result",
    authenticateUser,
    verifyUser,
    UsersController.updateUserScore
  )
  .get("/result", authenticateUser, verifyUser, UsersController.showUserScore);

export default userRouter;
