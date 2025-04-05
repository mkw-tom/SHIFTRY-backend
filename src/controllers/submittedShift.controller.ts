import type { Request, Response } from "express";
import {
	getSubmittedShiftUser,
	getWeeklySubmittedShifts,
	upsertSubmittedShift,
} from "../repositories/submittedShift.repository";
import { getUserStoreByUserIdAndStoreId } from "../repositories/userStore.repository";
import { verifyUserStore } from "../services/common/authorization.service";
import { upsertSubmittedShifttValidate } from "../validations/submittedShift.vaidation";

export const upsertSubmittedShiftController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const parsedBody = upsertSubmittedShifttValidate.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).json({
				message: "Invalid request value",
				errors: parsedBody.error.errors,
			});
			return;
		}

		await upsertSubmittedShift(userId, storeId, parsedBody.data);

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
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

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
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const { shiftRequestId } = req.params;

		const weeklySubmittedShifts =
			await getWeeklySubmittedShifts(shiftRequestId);

		res.json({ weeklySubmittedShifts });
	} catch (error) {
		console.error("Failed to get weekly submitted shifts:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
