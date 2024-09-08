import Stripe from "stripe";
import dotenv from "dotenv";
// import StripeCheckout from "react-stripe-checkout";
dotenv.config();
export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2024-06-20",
});
