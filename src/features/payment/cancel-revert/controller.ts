import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/types/errors";
import cancelRevertService from "./service";
import type { CancelRevertResponse } from "./type";

const cancelRevertController = async (
	req: Request,
	res: Response<CancelRevertResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const revertPayment = await cancelRevertService({ storeId });

		res.status(200).json({ ok: true, revertPayment });
	} catch (error) {
		console.error("Cancel revert error:", error);
		res
			.status(500)
			.json({ ok: false, message: "Failed to revert cancellation" });
	}
};

export default cancelRevertController;
