import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import passport from "passport";
import cors from "cors";
import userRouter from "./routes/userRouter";
import dotenv from "dotenv";
import { errorHandler } from "./errors/error";
import { routeError } from "./errors/route.error";
dotenv.config();

const corsOptions = {
  origin: true,
  credentials: true, //included credentials as true
  preflightContinue: true,
};
const app = express();
app
  .use(cors(corsOptions))
  .use(json())
  .use(
    cookieSession({
      signed: false,
      secure: false, //process.env.NODE_ENV !== "test"
      maxAge: 24 * 60 * 60 * 5000,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use("/api/v1/user", userRouter)

  .use(routeError)
  .use(errorHandler);

export default app;
