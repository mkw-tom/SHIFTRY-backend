import type { Request, Response } from "express";
import {
	getAssignShift,
	upsertAssignShfit,
} from "../../../../repositories/assingShift.repostory";
import {
	verifyUserStore,
	verifyUserStoreForOwnerAndManager,
} from "../../../common/authorization.service";
import type { ErrorResponse } from "../../../common/type";
import type {
	AssigShiftResponse,
	UpsertAssignShiftValidationErrorResponse,
} from "./type";
import { upsertAssignShfitValidate } from "./validation";

export const upsertAssignShfitController = async (
	req: Request,
	res: Response<
		| AssigShiftResponse
		| UpsertAssignShiftValidationErrorResponse
		| ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const parsedBody = upsertAssignShfitValidate.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsedBody.error.errors,
			});
			return;
		}

		const assignShift = await upsertAssignShfit(storeId, parsedBody.data);
		res.json({ ok: true, assignShift });
	} catch (error) {
		console.error("Failed to upsert assign shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export const getAssignShiftController = async (
	req: Request,
	res: Response<AssigShiftResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const { shiftRequestId } = req.params;

		const assignShift = await getAssignShift(shiftRequestId);
		if (!assignShift) {
			res.status(404).json({ ok: false, message: "assignShift is not found" });
			return;
		}

		res.status(200).json({ ok: true, assignShift });
	} catch (error) {
		console.error("Failed to get assign shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};
