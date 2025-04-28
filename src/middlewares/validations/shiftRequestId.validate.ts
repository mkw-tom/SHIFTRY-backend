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

interface ShiftRequestIdRequest extends Request {
	shiftRequestId: string;
}

export const validateshiftRequestId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = shiftRequestIdParamValidate.parse(req.params);

		const shiftRequestId = parsed.shiftRequestId;
		(req as ShiftRequestIdRequest).shiftRequestId = shiftRequestId;
		next();
	} catch (error) {
		res
			.status(400)
			.json({ ok: false, message: "Invalid parameter shiftRequestId" });
	}
};
