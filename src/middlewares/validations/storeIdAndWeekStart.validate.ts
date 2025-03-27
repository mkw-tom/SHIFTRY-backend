import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../../config/database";

const StoreIdAndWeekStartParamValidate = z.object({
	storeId: z.string().uuid({ message: "Invalid storeId format" }),
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});
export type StoreIdAndWeekStartParamValidate = z.infer<
	typeof StoreIdAndWeekStartParamValidate
>;

interface StoreIdRequest extends Request {
	storeId: string;
}
interface weekStartRequest extends Request {
	weekStart: Date;
}

export const validateStoreIdAndWeekStart = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const parsed = StoreIdAndWeekStartParamValidate.safeParse(req.params);
	if (!parsed.success) {
		res.status(400).json({
			message: "Invalid parameters",
			errors: parsed.error.errors,
		});
		return;
	}

	const { storeId, weekStart } = parsed.data;
	(req as StoreIdRequest).storeId = storeId;
	(req as weekStartRequest).weekStart = new Date(weekStart);
	next();
};
