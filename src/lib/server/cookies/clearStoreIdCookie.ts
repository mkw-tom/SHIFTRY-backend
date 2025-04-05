import type { Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";

export const clearStoreIdCookie = (res: Response): void => {
	const isSecure = process.env.NODE_ENV !== "test";

	res.cookie("store_token", "", {
		httpOnly: true,
		secure: isSecure,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7日間
		path: "/",
	});
};
