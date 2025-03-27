import { ShiftStatus } from "@prisma/client";
import { string, z } from "zod";
import { storeIdParamValidate } from "../middlewares/validations/storeId.validate";

const timeSlotValidate = z.object({
	time: z.string(), // より厳密にするなら後述
	required: z.number().min(1),
});

const ShiftToSubmitValidate = z.object({
	monday: z.array(timeSlotValidate),
	tuesday: z.array(timeSlotValidate),
	wednesday: z.array(timeSlotValidate),
	thursday: z.array(timeSlotValidate),
	friday: z.array(timeSlotValidate),
	saturday: z.array(timeSlotValidate),
	sunday: z.array(timeSlotValidate),
});

export type ShiftToSubmitType = z.infer<typeof ShiftToSubmitValidate>;

export const upsertSubmittedShifttValidate = z.object({
	storeId: z.string(),
	shiftRequestId: z.string(),
	attendCount: z.number().min(1).max(7),
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	weekEnd: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	shifts: ShiftToSubmitValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertSubmittedShiftInput = z.infer<
	typeof upsertSubmittedShifttValidate
>;
