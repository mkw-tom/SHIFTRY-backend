import type { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { handleStripeEvent } from "../services/stripe.service";

export const stripeWebhookController = async (req: Request, res: Response) => {
	const sig = req.headers["stripe-signature"] as string;

	try {
		const event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET as string,
		);

		await handleStripeEvent(event);

		res.status(200).json({ received: true });
	} catch (error) {
		console.error("Stripe Webhook error:", error);
		res.status(400).json({ message: "Webhook processing failed" });
	}
};
