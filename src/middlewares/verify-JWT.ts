import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			userId: string;
		};

		req.userId = decoded.userId;
		next();
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
		return;
	}
};
