import type { Request, Response } from "express";
import { setUserLoginCookie } from "../lib/server/cookies/setLoginUserCookies";
import {
	authMe,
	lineAuth,
	login,
	registerOwner,
	registerStaff,
	storeLogin,
} from "../services/auth.service";
import { verifyUser } from "../services/common/authorization.service";
import { generateJWT } from "../utils/JWT/jwt";
import {
	groupIdValidate,
	reLoginUserIdValidate,
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

		res.status(200).json({ ok: true, userId, name, pictureUrl });
	} catch (error) {
		console.error("Error in getAuthenticatedUserController:", error);
		res.status(500).json({ ok: false, message: "faild line Authentication" });
	}
};

/// ログイン時に　bearer認証　（JWT）
export const authMeUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);
		const user = await authMe(userId);
		res.status(200).json({ ok: true, user });
	} catch (error) {
		console.error("Error in getAuthenticatedUserController:", error);
		res
			.status(401)
			.json({ ok: false, message: "Not affiliated with any stores" });
	}
};

export const reLoginController = async (req: Request, res: Response) => {
	try {
		const bodyParesed = reLoginUserIdValidate.parse(req.body);
		const userId = bodyParesed.userId;
		setUserLoginCookie(res, userId);

		res.json({ ok: true });
	} catch (error) {
		console.error("Error in getAuthenticatedUserController:", error);
		res.status(401).json({ ok: false, message: " Faild to authentication" });
	}
};

/// オーナーの新規登録
export const registerOwnerController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
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
			userInput: userInputParsed.data,
			storeInput: storeInputParsed.data,
		};

		const { user, store } = await registerOwner(userInput, storeInput);
		const token = generateJWT({ userId: user.id });
		const store_token = generateJWT({ storeId: store.id });
		// setRegisterOwnerCookies(res, user.id, store.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in registerOwnerController:", error);
		res.status(500).json({ ok: false, message: "failed to register owner" });
	}
};

/// スタッフの新規登録
export const registerStaffController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		// const { userInput, groupId } = req.body;
		const groupId = req.groupId as string;
		const userInputParsed = userInputValidate.safeParse(req.body.userInput);
		// const { groupId } = groupIdValidate.parse(req.body);
		if (!userInputParsed.success) {
			res.status(400).json({
				message: "Invalid request",
				errors: {
					user: userInputParsed.error?.errors,
				},
			});
			return;
		}
		const userInput = userInputParsed.data;

		const { user, store } = await registerStaff(userInput, groupId);
		// const token = generateJWT(user.id);
		const token = generateJWT({ userId: user.id });
		// setUserLoginCookie(res, user.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in registerStaffController:", error);
		res.status(500).json({ ok: false, message: "failed to register staff" });
	}
};

//// 通常ログイン（リッチメニュー）
export const loginController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;

		const { user, stores } = await login(userId);
		const token = generateJWT({ userId: user.id });
		// setUserLoginCookie(res, user.id);

		res.json({ ok: true, user, stores, token });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login" });
	}
};

//// 店舗データに即ログイン　　（lineグループないから）
export const loginStoreControler = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const groupId = req.groupId as string;

		// const { groupId } = groupIdValidate.parse(req.body);

		const { user, store } = await storeLogin(userId, groupId);
		const token = generateJWT({ userId: user.id });
		// setUserLoginCookie(res, user.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login to store" });
	}
};
