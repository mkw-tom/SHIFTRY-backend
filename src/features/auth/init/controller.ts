import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";
import type { ErrorResponse } from "../../common/type";
import Init from "./service";
import type { InitResponse } from "./type";
import { storeIdValidate } from "./validation";

const InitController = async (
	req: Request,
	res: Response<InitResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const { storeId } = storeIdValidate.parse(req.body);

		const { user, store, shiftRequest } = await Init(userId, storeId);
		const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		const group_token = generateJWT({ groupId: store.groupId as string });

		res.json({
			ok: true,
			user,
			store,
			shiftRequest,
			user_token,
			store_token,
			group_token,
		});
	} catch (error) {
		console.error("Error in loginInitController:", error);
		res.status(500).json({ ok: false, message: "failed to login init" });
	}
};

export default InitController;
