import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const WeekStartParamValidate = z.object({
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});
export type WeekStartParamValidate = z.infer<typeof WeekStartParamValidate>;

interface WeekStartRequest extends Request {
	weekStart: Date;
}

export const validateWeekStart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const parsed = WeekStartParamValidate.parse(req.params);
		const weekStart = parsed.weekStart;
		(req as WeekStartRequest).weekStart = new Date(weekStart);
		next();
	} catch (error) {
		res.status(400).json({ ok: false, message: "Invalid parameter weekStart" });
	}
};
