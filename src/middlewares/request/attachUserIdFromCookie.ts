import { parse } from "cookie";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const attachUserIdFromCookie = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const cookieHeader = req.headers.cookie || "";
	const cookies = parse(cookieHeader);

	const token = cookies.token;

	if (!token) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			userId: string;
		};
		if (!decoded.userId) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		req.userId = decoded.userId;
		next(); // ✅ ここで controller 側に渡す！
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};
