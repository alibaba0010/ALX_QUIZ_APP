import { StatusCodes } from "http-status-codes";
import Ticket from "../models/events/ticketDB";
import {
  checkDate,
  checkIfCreaator,
  checkIfExists,
  createPayment,
  decrementQuantity,
  requiredFields,
  sendEmail,
  ticketBooked,
} from "../models/events/eventModel";
import { findUser } from "../models/users/userModel";
import Event from "../models/events/eventDB.js";
import { v4 as uuidv4 } from "uuid";
class EventsController {
  static async httpAddNewEvent(request, response) {
    const { userId } = request.user;
    const { name, description, date, quantity, price } = request.body;
    requiredFields(name, date, quantity, price);
    checkDate(date);

    const eventCreated = await Event.create({
      name,
      description,
      userId,
      date,
      tickets: [
        {
          id: uuidv4(),
          price,
          quantity,
        },
      ],
    });

    response.status(StatusCodes.CREATED).json({
      name: eventCreated.name,
      description: eventCreated.description,
      date: eventCreated.date,
    });
  }

  // GET A SPECIFIC EVENT
  static async httpGetEvent(request, response) {
    const { eventId } = request.params;
    const event = await Event.findById(eventId);
    if (!event) throw new NotFoundError("Event not found");
    return response.status(StatusCodes.OK).json(event);
  }
  static async httpGetEvents(request, response) {
    const { userId } = request.user;
    const events = await Event.find({ userId });
    return response
      .status(StatusCodes.OK)
      .json({ events, nbHits: events.length });
  }
  static async httpGetAllEvents(request, response) {
    const { userId } = request.user;
    await findUser(userId);
    const events = await Event.find({});
    return response
      .status(StatusCodes.OK)
      .json({ events, nbHits: events.length });
  }
  static async httpGetTickets(request, response) {
    const { userId } = request.user;
  }
  static async httpBookTicket(request, response) {
    const { userId } = request.user;
    const { eventId } = request.params;

    await checkIfCreaator(userId);
    const user = await findUser(userId);
    const token = "tok_visa" || request.body.token;
    const event = await checkIfExists(eventId);

    const quantity = event.tickets[0].quantity;
    const ticket = event.tickets[0].isBooked;
    const price = event.tickets[0].price;

    const newQuantity = decrementQuantity(quantity);
    const booked = ticketBooked(ticket);
    const checkout = await createPayment(token, price);
    const ticketId = event.tickets[0].id;

    event.tickets[0].isBooked = booked;
    event.tickets[0].quantity = newQuantity;
    const { email } = user;
    const userName = user.name;
    const { date, name } = event;
    await Ticket.create({
      userId,
      stripeId: checkout.id,
      email: user.email,
      eventId,
      ticketId,
      price: event.tickets[0].price,
    });

    await event.save();
    // await sendEmail(userName, email, name, date);
    response
      .status(StatusCodes.OK)
      .json({ message: "Ticket booked successfully" });
  }
}
export default EventsController;
