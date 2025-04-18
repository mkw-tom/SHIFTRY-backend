import type { Request, Response } from "express";
import prisma from "../config/database";
import { stripe } from "../config/stripe";
import { getPaymentByStoreId } from "../repositories/payment.repositroy";
import { getUserStoreByUserIdAndStoreId } from "../repositories/userStore.repository";
import { verifyUserStoreForOwner } from "../services/common/authorization.service";
import {
	cancelRevertService,
	cancelSubscriptionService,
	changePlanService,
	createPaymentService,
} from "../services/payment.service";
import {
	changePlanValidate,
	priceIdValidate,
} from "../validations/payment.validation";

export const getPaymentController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);
		const payment = await getPaymentByStoreId(storeId);

		res.status(200).json({ payment });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "faild get payment data",
		});
	}
};

export const createPaymentController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const bodyParsed = priceIdValidate.safeParse(req.body);
		if (!bodyParsed.success) {
			res.status(400).json({
				message: "invalid priceId",
				errors: bodyParsed.error.errors,
			});
			return;
		}

		const input = {
			userId,
			storeId,
			priceId: bodyParsed.data.priceId,
		};

		const payment = await createPaymentService(input);
		res.status(200).json({ ok: true, payment });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "faild create payment data",
		});
	}
};

export const changePlanController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);
		const parsed = changePlanValidate.safeParse(req.body);

		if (!parsed.success) {
			res.status(400).json({
				message: "Invalid request",
				errors: parsed.error.errors,
			});
			return;
		}

		const { priceId, plan } = parsed.data;
		const result = await changePlanService({ userId, storeId, priceId, plan });

		res.status(200).json(result);
	} catch (error) {
		console.error("Change plan error:", error);
		res.status(500).json({ message: "Failed to change plan" });
	}
};

/// 解約予約
export const cancelSubscriptionController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const result = await cancelSubscriptionService({ userId, storeId });

		res.status(200).json(result);
	} catch (error) {
		console.error("Cancel subscription error:", error);
		res.status(500).json({ message: "Failed to cancel subscription" });
	}
};

///解約予約の取り柄kし
export const cancelRevertController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;

		const result = await cancelRevertService({ userId, storeId });

		res.status(200).json(result);
	} catch (error) {
		console.error("Cancel revert error:", error);
		res.status(500).json({ message: "Failed to revert cancellation" });
	}
};
