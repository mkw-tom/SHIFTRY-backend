import type { NextFunction, Request, Response } from "express";

export const attachGroupId = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const groupId = req.headers["x-group-id"];
		if (!groupId || typeof groupId !== "string") {
			res.status(400).json({ message: "Missing or invalid groupId" });
			return;
		}

		req.groupId = groupId;
		next();
	} catch (err) {
		console.error("attachGroupId error:", err);
		res
			.status(401)
			.json({ message: "Unexpected error while attaching groupId" });
	}
};
