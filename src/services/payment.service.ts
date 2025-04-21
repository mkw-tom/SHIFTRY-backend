import prisma from "../config/database";
import { stripe } from "../config/stripe";
import {
	cancelRevert,
	cancelSubscription,
	createPayment,
	getPaymentByStoreId,
	updatePaymentPlan,
} from "../repositories/payment.repositroy";
import type {
	createPaymentType,
	productIdType,
} from "../validations/payment.validation";
import { verifyUserStoreForOwner } from "./common/authorization.service";

export const createPaymentService = async ({
	userId,
	storeId,
	paymentInfos,
}: {
	userId: string;
	storeId: string;
	paymentInfos: createPaymentType;
}) => {
	const { name, email, productId, paymentMethodId } = paymentInfos;
	const customer = await stripe.customers.create({
		email,
		name,
		metadata: { userId, storeId },
	});

	await stripe.paymentMethods.attach(paymentMethodId, {
		customer: customer.id,
	});

	// 顧客の支払い方法をデフォルト設定
	await stripe.customers.update(customer.id, {
		invoice_settings: {
			default_payment_method: paymentMethodId,
		},
	});

	const product = await stripe.products.retrieve(productId);
	const prices = await stripe.prices.list({ product: productId });
	const price = prices.data[0];

	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ price: price.id }],
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
		productId,
		priceId: price.id,
		price_amount: price.unit_amount,
		price_interval: price.recurring?.interval,
		subscription_status: subscription.status,
		isTrial: true,
		trial_end_date: trialEnd,
		next_billing_date: nextBilling,
		current_plan: product.name, // or 判定式でもOK
	};
	const payment = await createPayment(data);
	return payment;
};

/// プラン変更
export const changePlanService = async ({
	userId,
	storeId,
	productId,
}: {
	userId: string;
	storeId: string;
	productId: productIdType["productId"];
}) => {
	await verifyUserStoreForOwner(userId, storeId);

	const payment = await getPaymentByStoreId(storeId);
	if (!payment) throw new Error("Payment info not found");

	const prices = await stripe.prices.list({ product: productId });
	const price = prices.data[0]; // ※月額1つならOK（将来複数あればフィルタ追加）

	const product = await stripe.products.retrieve(productId);
	const planName = product.metadata.plan_type || product.name;

	const subscription = await stripe.subscriptions.retrieve(
		payment.subscriptionId,
	);
	const itemId = subscription.items.data[0].id;

	await stripe.subscriptions.update(payment.subscriptionId, {
		items: [
			{
				id: itemId,
				price: price.id,
			},
		],
	});

	await updatePaymentPlan(storeId, {
		productId,
		priceId: price.id,
		price_amount: price.unit_amount ?? 0,
		price_interval: price.recurring?.interval ?? "month",
		current_plan: planName,
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
