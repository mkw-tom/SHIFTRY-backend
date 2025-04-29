import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const UserIdParamValidate = z.object({
	userId: z.string().uuid({
		message: "Invalid UserId format",
	}),
});
export type UserIdParamValidate = z.infer<typeof UserIdParamValidate>;

interface UserIdRequest extends Request {
	userId: string;
}

export const validateUserId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = UserIdParamValidate.parse(req.params);

		const userId = parsed.userId;
		(req as UserIdRequest).userId = userId;
		next();
	} catch (error) {
		res.status(400).json({ ok: false, message: "Invalid parameter userId" });
	}
};
