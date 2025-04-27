import type { Request, Response } from "express";
import { generateJWT } from "../../../utils/JWT/jwt";
import { verifyUserByLineId } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/type";
import type { ReLoginResponse } from "./type";

export const reLoginController = async (
	req: Request,
	res: Response<ReLoginResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const lineId = req.lineId as string;
		const user = await verifyUserByLineId(lineId);

		const user_token = generateJWT({ userId: user.id });

		res.status(200).json({ ok: true, user_token });
	} catch (error) {
		console.error("faild to relogin", error);
		res.status(401).json({ ok: false, message: "faild to relogin" });
	}
};
