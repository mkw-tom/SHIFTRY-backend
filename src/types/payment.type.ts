import type Stripe from "stripe";

export type CreatePaymentInput = {
	storeId: string;
	userId: string;
	customerId: string;
	subscriptionId: string;
	productId: string;
	priceId: string;
	price_amount: number | null;
	price_interval: Stripe.Price.Recurring.Interval | undefined;
	subscription_status: string;
	isTrial: boolean;
	trial_end_date: Date;
	next_billing_date: Date;
	current_plan: string;
};
