import type { Request, Response } from "express";
import {
	getAssignShift,
	upsertAssignShfit,
} from "../repositories/assingShift.repostory";
import { getUserStoreByUserIdAndStoreId } from "../repositories/userStore.repository";
import {
	verifyUserStore,
	verifyUserStoreForOwnerAndManager,
} from "../services/common/authorization.service";
import { upsertAssignShfitValidate } from "../validations/assignShift.validation";

export const upsertAssignShfitController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsedBody = upsertAssignShfitValidate.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).json({
				message: "Invalid request value",
				errors: parsedBody.error.errors,
			});
			return;
		}

		const assignShift = await upsertAssignShfit(storeId, parsedBody.data);
		res.json({ ok: true });
	} catch (error) {
		console.error("Failed to upsert assign shift:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getAssignShiftController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const { weekStart } = req.params;

		const assingShift = await getAssignShift(storeId, weekStart);

		res.json({ assingShift });
	} catch (error) {
		console.error("Failed to get assign shift:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
