import Stripe from "stripe";
import "./env";
import "dotenv/config";

const stripeSecret = process.env.STRIPE_SECRET_KEY as string;

export const stripe = new Stripe(stripeSecret, {
	apiVersion: "2025-02-24.acacia",
});
