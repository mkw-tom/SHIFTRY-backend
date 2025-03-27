import type { Request, Response } from "express";
import {
	deleteShiftRequest,
	getShiftRequestByStoreId,
	getShiftRequestWeek,
	upsertShiftRequest,
} from "../repositories/shiftRequest.repository";
import { getUserById } from "../repositories/user.repository";
import { getUserStoreByUserIdAndStoreId } from "../repositories/userStore.repository";
import { upsertShfitRequestValidate } from "../validations/shiftRequest.validation";

export const getShiftRequestController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;

		const { storeId } = req.params;
		if (!storeId) {
			res.status(400).json({ message: "storId is not found" });
		}

		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
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
		const storeId = req.params.storeId;
		const weekStart = req.params.weekStart;
		const weekShift = await getShiftRequestWeek(storeId, weekStart);

		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

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

		const bodyParesed = upsertShfitRequestValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				message: "invalid request value",
				errors: bodyParesed.error.errors,
			});
			return;
		}
		const { storeId, weekStart, weekEnd, requests, status, deadline } =
			bodyParesed.data;

		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (userStore?.role !== "OWNER" && userStore?.role !== "MANAGER") {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

		await upsertShiftRequest({
			storeId,
			weekStart,
			weekEnd,
			requests,
			status,
			deadline,
		});

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
		const storeId = req.params.storeId;
		const weekStart = req.params.weekStart;
		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

		await deleteShiftRequest(storeId, weekStart);

		res.json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
