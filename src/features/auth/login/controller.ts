import type { Request, Response } from "express";
import type { ErrorResponse } from "../../common/type";
import login from "./service";
import type { LoginResponse } from "./type";

export const loginController = async (
	req: Request,
	res: Response<LoginResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;

		const { user, stores } = await login(userId);

		res.json({ ok: true, user, stores });
	} catch (error) {
		console.error("Error in loginController:", error);
		res.status(500).json({ ok: false, message: "failed to login" });
	}
};
