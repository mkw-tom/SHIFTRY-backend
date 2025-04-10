import { ShiftStatus } from "@prisma/client";
import { z } from "zod";

// const shiftSlot = z.object({
// 	time: z.string().min(1, { message: "time is required" }),
// 	users: z.array(z.string().max(200)),
// });
// export const shiftToAssignValidate = z.object({
// 	monday: z.array(shiftSlot),
// 	tuesday: z.array(shiftSlot),
// 	wednesday: z.array(shiftSlot),
// 	thursday: z.array(shiftSlot),
// 	friday: z.array(shiftSlot),
// 	saturday: z.array(shiftSlot),
// 	sunday: z.array(shiftSlot),
// });

// export type shiftToAssignType = z.infer<typeof shiftToAssignValidate>;

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
	// shifts: shiftToAssignValidate,
	shifts: shiftsOfAssignValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertAssignShfitInput = z.infer<typeof upsertAssignShfitValidate>;
