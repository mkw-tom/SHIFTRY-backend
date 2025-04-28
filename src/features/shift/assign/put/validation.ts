import { ShiftStatus } from "@prisma/client";
import { z } from "zod";

export const shiftsOfAssignValidate = z.record(
	z.string(), // userId
	z.array(
		z.object({
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			time: z.string(), // "09:00-13:00"
		}),
	),
);
export type ShiftsOfAssignType = z.infer<typeof shiftsOfAssignValidate>;

export const upsertAssignShfitValidate = z.object({
	shiftRequestId: z.string().uuid(),
	shifts: shiftsOfAssignValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertAssignShfitInput = z.infer<typeof upsertAssignShfitValidate>;
