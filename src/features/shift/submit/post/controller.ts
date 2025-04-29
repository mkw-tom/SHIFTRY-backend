import type { Request, Response } from "express";

import { upsertSubmittedShift } from "../../../../repositories/submittedShift.repository";
import { verifyUserStore } from "../../../common/authorization.service";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "../../../common/type";
import type { UpsertSubmittedShfitResponse } from "./type";
import { upsertSubmittedShifttValidate } from "./validation";

const upsertSubmittedShiftController = async (
	req: Request,
	res: Response<
		UpsertSubmittedShfitResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const parsed = upsertSubmittedShifttValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request value",
				errors: parsed.error.errors,
			});
			return;
		}

		const submittedShift = await upsertSubmittedShift(
			userId,
			storeId,
			parsed.data,
		);

		res.json({ ok: true, submittedShift });
	} catch (error) {
		console.error("Failed to upsert submitted shift:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertSubmittedShiftController;
