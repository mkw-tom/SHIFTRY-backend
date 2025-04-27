import type { Request, Response } from "express";
import { upsertAssignShfit } from "../../../../../repositories/assingShift.repostory";
import { verifyUserStoreForOwnerAndManager } from "../../../../common/authorization.service";
import type { ErrorResponse } from "../../../../common/type";
import type {
	UpsertAssigShiftResponse,
	UpsertAssignShiftValidationErrorResponse,
} from "./type";
import { upsertAssignShfitValidate } from "./validation";

const upsertAssignShfitController = async (
	req: Request,
	res: Response<
		| UpsertAssigShiftResponse
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

export default upsertAssignShfitController;
