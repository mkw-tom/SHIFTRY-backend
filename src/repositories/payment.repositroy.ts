import prisma from "../config/database";

export const createPayment = async (data: {
	storeId: string;
	userId: string;
	customerId: string;
	subscriptionId: string;
	priceId: string;
	subscription_status: string;
	isTrial: boolean;
	trial_end_date: Date;
	next_billing_date: Date;
	current_plan: string;
}) => {
	return await prisma.payment.create({ data });
};

export const getPaymentByStoreId = async (storeId: string) => {
	return await prisma.payment.findUnique({ where: { storeId } });
};

export const updatePaymentPlan = async (
	storeId: string,
	data: { priceId: string; current_plan: string },
) => {
	return await prisma.payment.update({
		where: { storeId },
		data,
	});
};

export const cancelSubscription = async (storeId: string, cancelDate: Date) => {
	return await prisma.payment.update({
		where: { storeId },
		data: {
			cancel_requested_at: new Date(),
			cancel_at_period_end: true,
			delete_scheduled_at: cancelDate,
		},
	});
};

export const cancelRevert = async (storeId: string) => {
	return await prisma.payment.update({
		where: { storeId },
		data: {
			cancel_requested_at: null,
			cancel_at_period_end: false,
			delete_scheduled_at: null,
		},
	});
};
