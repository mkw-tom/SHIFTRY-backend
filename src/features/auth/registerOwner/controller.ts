import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";
import type { ErrorResponse } from "../../common/type";
import registerOwner from "./service";
import type { BodyErrorResponse, RegisterOwnerResponse } from "./type";
import { storeInputValidate, userInputValidate } from "./validation";

const registerOwnerController = async (
	req: Request,
	res: Response<RegisterOwnerResponse | ErrorResponse | BodyErrorResponse>,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;

		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		const storeInputParsed = storeInputValidate.safeParse(req.body.storeInput);

		// バリデーションエラー処理
		if (!userInputParsed.success || !storeInputParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request body",
				errors: {
					user: userInputParsed.error?.errors,
					store: storeInputParsed.error?.errors,
				},
			});
			return;
		}

		// データ組み立て
		const { userInput, storeInput } = {
			userInput: { ...userInputParsed.data, lineId },
			storeInput: storeInputParsed.data,
		};

		const { user, store } = await registerOwner(userInput, storeInput);

		const user_token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });

		res.status(200).json({
			ok: true,
			user,
			store,
			user_token,
			store_token,
		});
	} catch (error) {
		console.error("Error in registerOwnerController:", error);
		res.status(500).json({
			ok: false,
			message: "Failed to register owner",
		});
	}
};

export default registerOwnerController;
