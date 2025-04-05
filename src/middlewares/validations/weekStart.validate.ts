import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const WeekStartParamValidate = z.object({
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});
export type WeekStartParamValidate = z.infer<typeof WeekStartParamValidate>;

interface weekStartRequest extends Request {
	weekStart: Date;
}

export const validateWeekStart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const parsed = WeekStartParamValidate.parse(req.params);
	if (!parsed.weekStart) {
		res.status(400).json({
			message: "Invalid parameter weekStart",
		});
		return;
	}

	const weekStart = parsed.weekStart;
	(req as weekStartRequest).weekStart = new Date(weekStart);
	next();
};
