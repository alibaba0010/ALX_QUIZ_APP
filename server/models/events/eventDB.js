import pkg, { Types } from "mongoose";
const { Schema, model } = pkg;

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please select a date"],
    },
    isAvailale: {
      type: Boolean,
      default: true,
    },
    tickets: [
      {
        id: {
          type: String,
        },
        price: {
          type: Number,
          required: [true, "Please enter a price"],
        },
        quantity: {
          type: Number,
          required: [true, "Please enter a quantity"],
        },
        isBooked: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Event = model("Event", EventSchema);
export default Event;
