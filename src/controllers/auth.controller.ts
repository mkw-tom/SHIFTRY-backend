import type { Request, Response } from "express";
import {
	Init,
	authMe,
	lineAuth,
	login,
	registerOwner,
	registerStaff,
	storeLogin,
} from "../services/auth.service";
import {
	verifyUser,
	verifyUserByLineId,
} from "../services/common/authorization.service";
import { generateJWT } from "../utils/JWT/jwt";
import {
	reLoginUserIdValidate,
	storeIdValidate,
	storeIdandShfitReruestIdValidate,
	userInputValidate,
} from "../validations/auth.validation";
import { storeInputValidate } from "../validations/store.validation";

/// lineAuth認証でuserIdを取得
export const lineAuthController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { code } = req.body;
		const userData = await lineAuth(code);
		if (!userData) {
			res
				.status(400)
				.json({ ok: false, message: " faild line authentication" });
			return;
		}
		const { userId, name, pictureUrl } = userData;
		if (!userId || !name || !pictureUrl) {
			res.status(400).json({ ok: false, message: " faild get user profile" });
			return;
		}
		const line_token = generateJWT({ lineId: userId });

		res.status(200).json({ ok: true, userId, name, pictureUrl, line_token });
	} catch (error) {
		console.error("Error in getAuthenticatedUserController:", error);
		res.status(500).json({ ok: false, message: "faild line Authentication" });
	}
};

/// オーナー登録
export const registerOwnerController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;
		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		const storeInputParsed = storeInputValidate.safeParse(req.body.storeInput);
		// const { userInput, storeInput } = req.body;

		if (!userInputParsed.success || !storeInputParsed.success) {
			res.status(400).json({
				message: "Invalid request",
				errors: {
					user: userInputParsed.error?.errors,
					store: storeInputParsed.error?.errors,
				},
			});
			return;
		}
		const { userInput, storeInput } = {
			userInput: { ...userInputParsed.data, lineId },
			storeInput: storeInputParsed.data,
		};

		const { user, store } = await registerOwner(userInput, storeInput);
		const token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		// setRegisterOwnerCookies(res, user.id, store.id);

		res.json({ ok: true, user, store, token, store_token });
	} catch (error) {
		console.error("Error in registerOwnerController:", error);
		res.status(500).json({ ok: false, message: "failed to register owner" });
	}
};

/// スタッフ登録
export const registerStaffController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;
		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		if (!userInputParsed.success) {
			res.status(400).json({
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
		const token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		const group_token = generateJWT({ groupId: store.groupId as string });

		res.json({ ok: true, user, store, token, store_token, group_token });
	} catch (error) {
		console.error("Error in registerStaffController:", error);
		res.status(500).json({ ok: false, message: "failed to register staff" });
	}
};

///再ログイン
export const reLoginController = async (req: Request, res: Response) => {
	try {
		const lineId = req.lineId as string;
		const user = await verifyUserByLineId(lineId);

		const user_token = generateJWT({ userId: user.id });

		res.status(200).json({ ok: true, user_token });
		res.json({ ok: true });
	} catch (error) {
		console.error("faild to relogin", error);
		res.status(401).json({ ok: false, message: "faild to relogin" });
	}
};

//// userIdから所属店舗データ取得
export const loginController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;

		const { user, stores } = await login(userId);

		res.json({ ok: true, user, stores });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login" });
	}
};

/// ログイン時にuser,store,shiftRequestを取得
export const InitController = async (req: Request, res: Response) => {
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

//// 店舗データに即ログイン　　（lineグループないから）
// export const loginStoreControler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.userId as string;
//     const { storeId } = storeIdValidate.parse(req.body);

//     const { user, store } = await storeLogin(userId, storeId);
//     const token = generateJWT({ userId: user.id });
//     const store_token = generateJWT({ storeId: store?.id as string });
//     const group_token = generateJWT({ groupId: store?.groupId as string });

//     res.json({ ok: true, user, store, token, store_token, group_token });
//   } catch (error) {
//     console.error("Error in loginController:", error);
//     res.status(500).json({ ok: false, message: "failed to login to store" });
//   }
// };

/// ログイン時に　bearer認証　（JWT）
// export const authMeUserController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.userId as string;
//     await verifyUser(userId);
//     const user = await authMe(userId);
//     res.status(200).json({ ok: true, user });
//   } catch (error) {
//     console.error("Error in getAuthenticatedUserController:", error);
//     res
//       .status(401)
//       .json({ ok: false, message: "Not affiliated with any stores" });
//   }
// };
