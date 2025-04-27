import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";
import type { ErrorResponse } from "../../common/type";
import registerOwner from "./service";
import type {
	RegisterOwnerResponse,
	RegisterOwnerValidationErrorResponse,
} from "./type";
import { storeNameValidate, userInputValidate } from "./validation";

const registerOwnerController = async (
	req: Request,
	res: Response<
		RegisterOwnerResponse | ErrorResponse | RegisterOwnerValidationErrorResponse
	>,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;

		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		const storeNameParsed = storeNameValidate.safeParse(req.body.storeInput);

		// バリデーションエラー処理
		if (!userInputParsed.success || !storeNameParsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request body",
				errors: {
					user: userInputParsed.error?.errors,
					store: storeNameParsed.error?.errors,
				},
			});
			return;
		}

		// データ組み立て
		const { userInput, storeInput } = {
			userInput: { ...userInputParsed.data, lineId },
			storeInput: storeNameParsed.data,
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
