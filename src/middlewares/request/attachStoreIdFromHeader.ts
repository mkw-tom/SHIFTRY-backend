import type { NextFunction, Request, Response } from "express";

export const attachStoreIdFromHeader = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const storeId = req.headers["x-store-id"];
		if (!storeId || typeof storeId !== "string") {
			res.status(400).json({ message: "Missing or invalid storeId" });
			return;
		}

		req.storeId = storeId;
		next();
	} catch (err) {
		res
			.status(401)
			.json({ message: "Unexpected error while attaching storeId" });
	}
};
