import type { Request, Response } from "express";
import {
	deleteShiftRequest,
	getShiftRequestByStoreId,
	getShiftRequestWeek,
	upsertShiftRequest,
} from "../repositories/shiftRequest.repository";
import { getUserById } from "../repositories/user.repository";
import { getUserStoreByUserIdAndStoreId } from "../repositories/userStore.repository";
import {
	verifyUserStore,
	verifyUserStoreForOwnerAndManager,
} from "../services/common/authorization.service";
import { upsertShfitRequestValidate } from "../validations/shiftRequest.validation";

export const getShiftRequestController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		if (!storeId) {
			res.status(400).json({ message: "storId is not found" });
		}

		const shiftRequests = await getShiftRequestByStoreId(storeId);

		res.json({ shiftRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getShiftRequestWeekController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const weekStart = req.params.weekStart;
		const weekShift = await getShiftRequestWeek(storeId, weekStart);

		res.json({ weekShift });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const upsertShiftRequestController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = upsertShfitRequestValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				message: "invalid request value",
				errors: bodyParesed.error.errors,
			});
			return;
		}
		const { weekStart, weekEnd, requests, status, deadline } = bodyParesed.data;

		const upsertData = {
			weekStart,
			weekEnd,
			requests,
			status,
			deadline,
		};

		await upsertShiftRequest(storeId, upsertData);

		res.json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const deleteShiftRequestController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const weekStart = req.params.weekStart;

		await deleteShiftRequest(storeId, weekStart);

		res.json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
