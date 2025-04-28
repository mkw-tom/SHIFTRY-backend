import type { Request, Response } from "express";
import { deleteShiftRequest } from "../../../../repositories/shiftRequest.repository";
import { verifyUserStoreForOwnerAndManager } from "../../../common/authorization.service";
import type { ErrorResponse } from "../../../common/type";
import type { DeleteShiftRequestResponse } from "./type";

const deleteShiftRequestController = async (
	req: Request,
	res: Response<DeleteShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const weekStart = req.params.weekStart;

		const shiftRequest = await deleteShiftRequest(storeId, weekStart);

		res.json({ ok: true, shiftRequest });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default deleteShiftRequestController;
