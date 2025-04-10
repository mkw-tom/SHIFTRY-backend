import { de } from "@faker-js/faker/.";
import { parse } from "cookie";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const attachStoreIdFromCookie = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const cookieHeader = req.headers.cookie || "";
	const cookies = parse(cookieHeader);

	const storeToken = cookies.store_token;

	if (!storeToken) {
		res.status(401).json({ message: "No storeToken provided" });
		return;
	}

	try {
		const decoded = jwt.verify(
			storeToken,
			process.env.JWT_SECRET as string,
		) as {
			storeId: string;
		};
		if (!decoded.storeId) {
			res.status(401).json({ message: "Invalid storeToken" });
			return;
		}

		req.storeId = decoded.storeId;
		next(); // ✅ ここで controller 側に渡す！
	} catch (err) {
		res.status(401).json({ message: "Invalid storeToken" });
	}
};
