import pkg, { Types } from "mongoose";
const { Schema, model } = pkg;
import dotenv from "dotenv";
dotenv.config();

const TicketSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    eventId: {
      type: Types.ObjectId,
      required: true,
      ref: "Event",
    },
    ticketId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter a price"],
    },
  },
  { timestamps: true }
);

export default model("Ticket", TicketSchema);
