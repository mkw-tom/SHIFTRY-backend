import { ShiftStatus } from "@prisma/client";
import { z } from "zod";

const shiftSlot = z.object({
	time: z.string().min(1, { message: "time is required" }),
	users: z.array(z.string().max(200)),
});
export const shiftToAssignValidate = z.object({
	monday: z.array(shiftSlot),
	tuesday: z.array(shiftSlot),
	wednesday: z.array(shiftSlot),
	thursday: z.array(shiftSlot),
	friday: z.array(shiftSlot),
	saturday: z.array(shiftSlot),
	sunday: z.array(shiftSlot),
});

// 型も自動で生成！
export type shiftToAssignType = z.infer<typeof shiftToAssignValidate>;

export const upsertAssignShfitValidate = z.object({
	shiftRequestId: z.string().uuid(),
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	weekEnd: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	shifts: shiftToAssignValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertAssignShfitInput = z.infer<typeof upsertAssignShfitValidate>;
