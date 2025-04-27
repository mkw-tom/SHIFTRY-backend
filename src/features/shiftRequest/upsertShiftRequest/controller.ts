import type { Request, Response } from "express";
import { upsertShiftRequest } from "../../../repositories/shiftRequest.repository";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/type";
import type {
	UpsertShiftRepuestValidationErrorResponse,
	UpsertShiftRequetResponse,
} from "./type";
import { upsertShfitRequestValidate } from "./validation";

const upsertShiftRequestController = async (
	req: Request,
	res: Response<
		| UpsertShiftRequetResponse
		| UpsertShiftRepuestValidationErrorResponse
		| ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = upsertShfitRequestValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: bodyParesed.error.errors,
			});
			return;
		}
		const { weekStart, weekEnd, type, requests, status, deadline } =
			bodyParesed.data;

		const upsertData = {
			weekStart,
			weekEnd,
			type,
			requests,
			status,
			deadline,
		};

		const shiftRequest = await upsertShiftRequest(storeId, upsertData);
		if (!shiftRequest) {
			res.status(404).json({ ok: false, message: "shiftRequest is not found" });
		}

		res.status(200).json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default upsertShiftRequestController;
