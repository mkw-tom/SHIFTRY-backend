import prisma from "../config/database";
import { stripe } from "../config/stripe";
import {
	cancelRevert,
	cancelSubscription,
	createPayment,
	getPaymentByStoreId,
	updatePaymentPlan,
} from "../repositories/payment.repositroy";
import { verifyUserStoreForOwner } from "./common/authorization.service";

export const createPaymentService = async ({
	userId,
	storeId,
	priceId,
}: {
	userId: string;
	storeId: string;
	priceId: string;
}) => {
	const customer = await stripe.customers.create({
		metadata: { userId, storeId },
	});

	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ price: priceId }],
		trial_period_days: 14,
		metadata: { storeId },
	});

	const trialEnd = new Date((subscription.trial_end as number) * 1000);
	const nextBilling = new Date(
		(subscription.current_period_end as number) * 1000,
	);

	const data = {
		storeId,
		userId,
		customerId: customer.id,
		subscriptionId: subscription.id,
		priceId,
		subscription_status: subscription.status,
		isTrial: true,
		trial_end_date: trialEnd,
		next_billing_date: nextBilling,
		current_plan: "basic", // or 判定式でもOK
	};
	const payment = await createPayment(data);
	return payment;
};

/// プラン変更
export const changePlanService = async ({
	userId,
	storeId,
	priceId,
	plan,
}: {
	userId: string;
	storeId: string;
	priceId: string;
	plan: string;
}) => {
	await verifyUserStoreForOwner(userId, storeId);

	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment info not found");

	// Stripeのプラン変更
	await stripe.subscriptions.update(payment.subscriptionId, {
		items: [{ price: priceId }],
	});

	// DB更新
	await updatePaymentPlan(storeId, {
		priceId,
		current_plan: plan,
	});

	return { ok: true };
};

/// 解約予約

export const cancelSubscriptionService = async ({
	userId,
	storeId,
}: {
	userId: string;
	storeId: string;
}) => {
	await verifyUserStoreForOwner(userId, storeId);

	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment not found");

	// Stripeのサブスクを次回請求でキャンセル予約
	const subscription = await stripe.subscriptions.update(
		payment.subscriptionId,
		{ cancel_at_period_end: true },
	);

	const cancelDate = new Date(subscription.current_period_end * 1000);

	await cancelSubscription(storeId, cancelDate);

	return { ok: true, cancelDate };
};

/// 解約予約の取り消し
export const cancelRevertService = async ({
	userId,
	storeId,
}: {
	userId: string;
	storeId: string;
}) => {
	await verifyUserStoreForOwner(userId, storeId);

	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment not found");

	await stripe.subscriptions.update(payment.subscriptionId, {
		cancel_at_period_end: false,
	});

	await cancelRevert(storeId);

	return { ok: true };
};
