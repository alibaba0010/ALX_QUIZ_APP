import { Router } from "express";
import EventsController from "../controllers/events.controller";
import { authenticateUser, verifyCreator, verifyUser } from "../utils/auth";

const eventRouter = Router();

eventRouter
  .post(
    "/event",
    authenticateUser,
    verifyCreator,
    EventsController.httpAddNewEvent
  )
  .get(
    "/events",
    authenticateUser,
    verifyCreator,
    EventsController.httpGetEvents
  )
  .get(
    "/events/:eventId",
    authenticateUser,
    verifyUser,
    EventsController.httpGetEvent
  )
  .get("/", authenticateUser, verifyUser, EventsController.httpGetAllEvents)
  .patch(
    "/:eventId",
    authenticateUser,
    verifyUser,
    EventsController.httpBookTicket
  )
  // GET TOTAL NO OF TICKETS BOOKED FOR THE EVENT
  .get(
    "/:eventId/tickets",
    authenticateUser,
    verifyCreator,
    EventsController.httpGetTickets
  );
export default eventRouter;
