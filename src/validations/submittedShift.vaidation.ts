import { ShiftStatus } from "@prisma/client";
import { z } from "zod";

// const timeSlotValidate = z.object({
// 	time: z.string(), // より厳密にするなら後述
// 	required: z.number().min(1),
// });

// const ShiftToSubmitValidate = z.object({
// 	monday: z.array(timeSlotValidate),
// 	tuesday: z.array(timeSlotValidate),
// 	wednesday: z.array(timeSlotValidate),
// 	thursday: z.array(timeSlotValidate),
// 	friday: z.array(timeSlotValidate),
// 	saturday: z.array(timeSlotValidate),
// 	sunday: z.array(timeSlotValidate),
// });

// export type ShiftToSubmitType = z.infer<typeof ShiftToSubmitValidate>;
export const shiftsOfSubmittedValidate = z.object({
	off: z.array(
		z.object({
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
			time: z.string().nullable(),
		}),
	),
	details: z.string(),
});
export type ShiftsOfSubmittedType = z.infer<typeof shiftsOfSubmittedValidate>;

export const upsertSubmittedShifttValidate = z.object({
	shiftRequestId: z.string(),
	attendCount: z.number().min(1).max(7),
	shifts: shiftsOfSubmittedValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertSubmittedShiftInput = z.infer<
	typeof upsertSubmittedShifttValidate
>;
