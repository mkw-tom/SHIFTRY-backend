import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const storeIdParamValidate = z.object({
	storeId: z.string().uuid(),
});
export type storeIdParamValidate = z.infer<typeof storeIdParamValidate>;

interface StoreIdRequest extends Request {
	storeId: string;
}

export const validateStoreId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const parsed = storeIdParamValidate.safeParse(req.params);
	if (!parsed.success) {
		res.status(400).json({ message: "Invalid storeId format" });
		return;
	}

	const { storeId } = parsed.data;
	if (!storeId) {
		res.status(400).json({ message: "storeId is required" });
		return;
	}
	(req as StoreIdRequest).storeId = storeId;
	next();
};
