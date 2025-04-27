import type { Request, Response } from "express";
import { getShiftRequestByStoreId } from "../../../repositories/shiftRequest.repository";
import { verifyUserStore } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/type";
import type { GetShiftRequestResponse } from "./type";

const getShiftRequestController = async (
	req: Request,
	res: Response<GetShiftRequestResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		if (!storeId) {
			res.status(400).json({ ok: false, message: "storId is not found" });
			return;
		}

		const shiftRequests = await getShiftRequestByStoreId(storeId);

		res.status(200).json({ ok: true, shiftRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getShiftRequestController;
