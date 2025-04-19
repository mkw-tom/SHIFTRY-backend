import { ShiftStatus } from "@prisma/client";
import { z } from "zod";

// export const shiftsOfSubmittedValidate = z.object({
// 	off: z.array(
// 		z.object({
// 			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
// 			time: z.string().nullable(),
// 		}),
// 	),
// 	details: z.string(),
// });
// export type ShiftsOfSubmittedType = z.infer<typeof shiftsOfSubmittedValidate>;
export const shiftsOfSubmittedValidate = z.object({
	name: z
		.string()
		.min(1, "ニックネームは必須です")
		.max(20, "20文字以内で入力してください"),
	weekCount: z.number().int().min(0).max(7), // 0〜7の整数で許容
	offWeeks: z
		.array(
			z.enum([
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			]),
		)
		.optional()
		.default([]),
	offDates: z
		.array(
			z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日付はYYYY-MM-DD形式で入力"),
		)
		.default([]),
	details: z
		.string()
		.max(200, "200文字以内で入力してください")
		.optional()
		.default(""),
	submittedAt: z
		.string()
		.datetime({ message: "ISO形式の日時で入力してください" }),
});
export type shiftsOfSubmittedType = z.infer<typeof shiftsOfSubmittedValidate>;

export const upsertSubmittedShifttValidate = z.object({
	shiftRequestId: z.string(),
	shifts: shiftsOfSubmittedValidate,
	status: z.nativeEnum(ShiftStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
});
export type upsertSubmittedShiftInput = z.infer<
	typeof upsertSubmittedShifttValidate
>;
