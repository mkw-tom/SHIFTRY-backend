import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const shiftRequestIdParamValidate = z.object({
	shiftRequestId: z.string().uuid({
		message: "Invalid shiftRequestId format",
	}),
});
export type shiftRequestIdParamValidate = z.infer<
	typeof shiftRequestIdParamValidate
>;

interface shiftRequestIdRequest extends Request {
	shiftRequestId: string;
}

export const validateshiftRequestId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const parsed = shiftRequestIdParamValidate.parse(req.params);
	if (!parsed.shiftRequestId) {
		res.status(400).json({
			message: "Invalid parameter shiftRequestId",
		});
		return;
	}

	const shiftRequestId = parsed.shiftRequestId;
	(req as shiftRequestIdRequest).shiftRequestId = shiftRequestId;
	next();
};
