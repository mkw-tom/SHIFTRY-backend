import type { Request, Response } from "express";
import {
	getSubmittedShiftUser,
	getWeeklySubmittedShifts,
	upsertSubmittedShift,
} from "../repositories/submittedShift.repository";
import { getUserStoreByUserIdAndStoreId } from "../repositories/userStore.repository";
import { upsertShfitRequestValidate } from "../validations/shiftRequest.validation";
import { upsertSubmittedShifttValidate } from "../validations/submittedShift.vaidation";

export const upsertSubmittedShiftController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const parsedBody = upsertSubmittedShifttValidate.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).json({
				message: "Invalid request value",
				errors: parsedBody.error.errors,
			});
			return;
		}
		const storeId = parsedBody.data.storeId;
		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

		await upsertSubmittedShift(userId, parsedBody.data);

		res.json({ ok: true });
	} catch (error) {
		console.error("Failed to upsert submitted shift:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getSubmittedShiftUserController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const { storeId } = req.params;
		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

		const upsertSubmittedShift = await getSubmittedShiftUser(userId, storeId);

		res.json({ upsertSubmittedShift });
	} catch (error) {
		console.error("Failed to get your submitted shifts:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getWeeklySubmittedShiftsController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const { storeId, weekStart } = req.params;
		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore) {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

		const weeklySubmittedShifts = await getWeeklySubmittedShifts(
			storeId,
			weekStart,
		);

		res.json({ weeklySubmittedShifts });
	} catch (error) {
		console.error("Failed to get weekly submitted shifts:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
