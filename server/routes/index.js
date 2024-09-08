import express, { json } from "express";
import "express-async-errors";
import userRouter from "./userRouter";
import eventRouter from "./eventsRouter";

const indexRouter = express();
indexRouter
  .use(json())
  .use("/users", userRouter)
  .use("/events", eventRouter)

export default indexRouter;
