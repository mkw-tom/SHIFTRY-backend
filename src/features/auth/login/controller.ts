import type { LoginResponse } from "@shared/auth/types/login";
import type { ErrorResponse } from "@shared/common/types/errors";
import type { Request, Response } from "express";
import login from "./service";

export const loginController = async (
	req: Request,
	res: Response<LoginResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;

		const { user, stores } = await login(userId);
		if (!user) {
			res.status(404).json({ ok: false, message: "login user is not found" });
			return;
		}
		if (stores.length === 0) {
			res.status(404).json({ ok: false, message: "stores data is not found" });
			return;
		}

		res.json({ ok: true, user, stores });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login" });
	}
};
