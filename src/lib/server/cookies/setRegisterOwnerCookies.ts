import type { Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";

export const setRegisterOwnerCookies = (
	res: Response,
	userId: string,
	storeId: string,
): void => {
	const token = generateJWT({ userId }); // トークン生成（7日間）
	const storeToken = generateJWT({ storeId });
	const isSecure = process.env.NODE_ENV !== "test";

	res.cookie("token", token, {
		httpOnly: true,
		secure: isSecure,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7日間
		path: "/",
	});

	res.cookie("store_token", storeToken, {
		httpOnly: true,
		secure: isSecure,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7日間
		path: "/",
	});
};
