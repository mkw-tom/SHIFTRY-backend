import type { Request, Response } from "express";
import { verifyUserStoreForOwner } from "../../common/authorization.service";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "../../common/types/errors";
import changePlanService from "./service";
import type { ChangePalnResponse } from "./type";
import { productIdValidate } from "./validation";

const changePlanController = async (
	req: Request,
	res: Response<ChangePalnResponse | ValidationErrorResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwner(userId, storeId);
		const parsed = productIdValidate.safeParse(req.body);

		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: parsed.error.errors,
			});
			return;
		}

		const productId = parsed.data.productId;
		const updatedPayment = await changePlanService({
			storeId,
			productId,
		});

		res.status(200).json({ ok: true, updatedPayment });
	} catch (error) {
		console.error("Change plan error:", error);
		res.status(500).json({ ok: false, message: "Failed to change plan" });
	}
};

export default changePlanController;
