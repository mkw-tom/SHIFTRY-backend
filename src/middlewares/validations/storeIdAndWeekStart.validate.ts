import { Request, Response, NextFunction } from "express";
import prisma from "../../config/database";
import { z } from "zod";

const StoreIdAndWeekStartParamValidate = z.object({
  storeId: z.string().uuid({ message: "Invalid storeId format" }),
  weekStart: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
export type StoreIdAndWeekStartParamValidate = z.infer<typeof StoreIdAndWeekStartParamValidate>;

export const validateStoreIdAndWeekStart = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = StoreIdAndWeekStartParamValidate.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid parameters",
      errors: parsed.error.errors,
    });
    return
  }

  const { storeId, weekStart } = parsed.data;
  (req as any).storeId = storeId;
  (req as any).weekStart = new Date(weekStart);
  next();
};
