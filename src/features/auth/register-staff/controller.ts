import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";
import type { ErrorResponse } from "../../common/type";
import { registerStaff } from "./service";
import type { BodyErrorResponse, RegisterStaffResponse } from "./type";
import {
	storeIdandShfitReruestIdValidate,
	userInputValidate,
} from "./validation";

const registerStaffController = async (
	req: Request,
	res: Response<RegisterStaffResponse | ErrorResponse | BodyErrorResponse>,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;
		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		if (!userInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: {
					user: userInputParsed.error?.errors,
				},
			});
			return;
		}
		const storeInputParsed = storeIdandShfitReruestIdValidate.safeParse(
			req.body.storeInput,
		);
		if (!storeInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: {
					user: storeInputParsed.error?.errors,
				},
			});
			return;
		}

		const userInput = { ...userInputParsed.data, lineId };
		const storeInput = storeInputParsed.data;

		const { user, store } = await registerStaff(userInput, storeInput);
		// const token = generateJWT(user.id);
		const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		const group_token = generateJWT({ groupId: store.groupId as string });

		res.json({ ok: true, user, store, user_token, store_token, group_token });
	} catch (error) {
		console.error("Error in registerStaffController:", error);
		res.status(500).json({ ok: false, message: "failed to register staff" });
	}
};

export default registerStaffController;
