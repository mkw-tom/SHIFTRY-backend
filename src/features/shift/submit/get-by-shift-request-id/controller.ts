import type { Request, Response } from "express";

import { getSubmittedShiftsSpecific } from "../../../../repositories/submittedShift.repository";
import { verifyUserStore } from "../../../common/authorization.service";
import type { ErrorResponse } from "../../../common/types/errors";
import type { GetSubmittedShiftsSpecificResponse } from "./type";

const getSubmittedShiftsSpesificController = async (
	req: Request,
	res: Response<GetSubmittedShiftsSpecificResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const { shiftRequestId } = req.params;

		const submittedShifts = await getSubmittedShiftsSpecific(shiftRequestId);
		if (submittedShifts.length === 0) {
			res
				.status(404)
				.json({ ok: false, message: "submittedShifts is not found" });
			return;
		}

		res.status(200).json({ ok: true, submittedShifts });
	} catch (error) {
		console.error("Failed to get weekly submitted shifts:", error);
		res.status(500).json({ ok: false, message: "Internal Server Error" });
	}
};

export default getSubmittedShiftsSpesificController;
