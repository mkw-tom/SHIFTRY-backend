import type { Payment } from "@prisma/client";
import Stripe from "stripe";
import prisma from "../config/database";
import type { CreatePaymentInput } from "../types/payment.type";

export const createPayment = async (data: CreatePaymentInput) => {
	return await prisma.payment.create({ data });
};

export const getPaymentByStoreId = async (
	storeId: string,
): Promise<Payment | null> => {
	return await prisma.payment.findUnique({ where: { storeId } });
};

export const updatePaymentPlan = async (
	storeId: string,
	data: {
		productId: string;
		priceId: string;
		current_plan: string;
		price_amount: number;
		price_interval: string;
	},
): Promise<Payment | null> => {
	return await prisma.payment.update({
		where: { storeId },
		data,
	});
};

export const cancelSubscription = async (
	storeId: string,
	cancelDate: Date,
): Promise<Payment | null> => {
	return await prisma.payment.update({
		where: { storeId },
		data: {
			cancel_requested_at: new Date(),
			cancel_at_period_end: true,
			delete_scheduled_at: cancelDate,
		},
	});
};

export const cancelRevert = async (
	storeId: string,
): Promise<Payment | null> => {
	return await prisma.payment.update({
		where: { storeId },
		data: {
			cancel_requested_at: null,
			cancel_at_period_end: false,
			delete_scheduled_at: null,
		},
	});
};
