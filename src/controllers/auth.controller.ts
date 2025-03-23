import type { Request, Response } from "express";
import {
	authMe,
	login,
	registerOwner,
	registerStaff,
	storeLogin,
} from "../services/auth.service";
import { generateJWT } from "../utils/JWT/jwt";

/// ログイン時に　bearer認証　（JWT）
export const authMeUserController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const user = await authMe(userId);
		res.status(200).json({ ok: true, user });
	} catch (error) {
		console.error("Error in getAuthenticatedUserController:", error);
		res
			.status(401)
			.json({ ok: false, message: "Not affiliated with any stores" });
	}
};

/// オーナーの新規登録
export const registerOwnerController = async (req: Request, res: Response) => {
	try {
		const { userInput, storeInput } = req.body;
		const { user, store } = await registerOwner(userInput, storeInput);
		const token = generateJWT(user.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in registerOwnerController:", error);
		res.status(500).json({ ok: false, message: "failed to register owner" });
	}
};

/// スタッフの新規登録
export const registerStaffController = async (req: Request, res: Response) => {
	try {
		const { userInput, groupId } = req.body;
		const { user, store } = await registerStaff(userInput, groupId);
		const token = generateJWT(user.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in registerStaffController:", error);
		res.status(500).json({ ok: false, message: "failed to register staff" });
	}
};

//// 通常ログイン
export const loginController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;

		const { user, store } = await login(userId);
		const token = generateJWT(user.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login" });
	}
};

//// 店舗データに即ログイン　　（シフト提出・確定通知リンクからのログイン）
export const storeLoginControler = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const { groupId } = req.body;

		const { user, store } = await storeLogin(userId, groupId);
		const token = generateJWT(user.id);

		res.json({ ok: true, user, store, token });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login to store" });
	}
};
