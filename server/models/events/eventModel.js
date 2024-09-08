import BadRequestError from "../../errors/badRequest";
import UnAuthorizedError from "../../errors/unauthorized";
import notFoundError from "../../errors/notFound";
import dotenv from "dotenv";
import Event from "./eventDB";
import { stripe } from "../../utils/stripe";
dotenv.config();
export const requiredFields = (name, date, quantity, price) => {
  if (!name || !name || !date || !quantity || !price)
    throw new BadRequestError("Please fill all required field");
};
export const checkIfExists = async (eventId) => {
  const checkEventExist = await Event.findById(eventId);
  if (!checkEventExist) throw new notFoundError("Event not found");
  return checkEventExist;
};

export const checkDate = (date) => {
  const currentDate = new Date();
  const newDate = Date.parse(currentDate);
  if (Date.parse(date) <= newDate)
    throw new BadRequestError("Date cannot be in the past");
};

//NOT IMPLEMENTED YET
export const checkifEventAvailabile = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new notFoundError("Event not found");
  const currentDate = new Date();
  const newDate = Date.parse(currentDate);
  const eventDate = Date.parse(event.createdAt);
  if (newDate < eventDate)
    throw new UnAuthorizedError("Event has not started yet");
};

export const decrementQuantity = (quantity) => {
  return --quantity;
};
export const ticketBooked = (ticket) => {
  return ++ticket;
};
export const checkIfCreaator = async (userId) => {
  const checkCreator = await Event.findOne({ userId });
  if (checkCreator) throw new UnAuthorizedError("Creator cant book a ticket");
};
export const checkIfTicketAvailable = async (eventId) => {
  const event = await Event.findById(eventId);
  if ((event.tickets[0].quantity = 0))
    throw new UnAuthorizedError("Ticket not available");
};

export const payTicket = async (event) => {
  const charge = await stripe.charges.create({
    currency: "usd",
    amount: order.price * 100,
    source: token,
  });
};

export const createPayment = async (token, price) => {
  const payment = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: "usd",
    // source: token,
    payment_method_types: ["card"],
  });
  return payment;
};

export const sendEmail = async (userName, email, name, date) => {
  //Send email here
  const message = `
  <h2>Hello ${userName}</h2>
  <h4>You've successfully book ticket for this event ${name} happening on ${date}</h4>  
  <p>We'll be glad to see you there</p>
  

 <p>Regards...</p>
 <p>AliBaba Team</p>
`;
  try {
    const subject = "Password Reset Request";
    const sendTo = email;
    const sentFrom = process.env.EMAIL_USER;
    const replyTo = process.env.EMAIL_USER;
    await sendEmail(message, subject, sentFrom, sendTo, replyTo);
  } catch (error) {
    throw new Error("Email not sent, please try again");
  }
};
