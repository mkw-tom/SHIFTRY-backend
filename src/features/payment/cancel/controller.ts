import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/types/errors";
import cancelSubscriptionService from "./service";
import type { CancelSubscriptionResponse } from "./type";

const cancelSubscriptionController = async (
	req: Request,
	res: Response<CancelSubscriptionResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);

		const { canceledPayment, cancelDate } = await cancelSubscriptionService({
			storeId,
		});

		res.status(200).json({ ok: true, canceledPayment, cancelDate });
	} catch (error) {
		console.error("Cancel subscription error:", error);
		res
			.status(500)
			.json({ ok: false, message: "Failed to cancel subscription" });
	}
};

export default cancelSubscriptionController;
