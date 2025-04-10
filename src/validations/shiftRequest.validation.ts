import { RequestStatus, ShiftType } from "@prisma/client";
import { z } from "zod";

/// request　プロパティのJSONデータのバリエーション
// const timeSlotSchema = z.object({
// 	time: z.string().min(1, { message: "time is required" }).max(50),
// 	required: z
// 		.number()
// 		.int()
// 		.min(1, { message: "required must be at least 1" })
// 		.max(10),
// });
// export const requestJsonSchema = z.object({
// 	monday: z.array(timeSlotSchema),
// 	tuesday: z.array(timeSlotSchema),
// 	wednesday: z.array(timeSlotSchema),
// 	thursday: z.array(timeSlotSchema),
// 	friday: z.array(timeSlotSchema),
// 	saturday: z.array(timeSlotSchema),
// 	sunday: z.array(timeSlotSchema),
// });

// // 型も自動で生成！
// export type RequestJsonType = z.infer<typeof requestJsonSchema>;

const TimeSlot = z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
	message: "Time must be in format HH:MM-HH:MM",
});
// DefaultTimePositions: 曜日 → 時間帯[]
const DefaultTimePositionsSchema = z.object({
	Monday: z.array(TimeSlot),
	Tuesday: z.array(TimeSlot),
	Wednesday: z.array(TimeSlot),
	Thursday: z.array(TimeSlot),
	Friday: z.array(TimeSlot),
	Saturday: z.array(TimeSlot),
	Sunday: z.array(TimeSlot),
});
// OverrideDates: 任意日 → 時間帯[]
const OverrideDatesSchema = z.record(
	z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD形式
	z.array(TimeSlot),
);
// 最終的な ShiftRequestTemplate のZodスキーマ
export const ShiftsOfRequestsValidate = z.object({
	defaultTimePositions: DefaultTimePositionsSchema,
	overrideDates: OverrideDatesSchema,
});

export type ShiftsOfRequestsType = z.infer<typeof ShiftsOfRequestsValidate>;

export const upsertShfitRequestValidate = z.object({
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	weekEnd: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	// requests: requestJsonSchema,
	type: z.nativeEnum(ShiftType, {
		errorMap: () => ({ message: "Invalid shift type" }),
	}),
	requests: ShiftsOfRequestsValidate,
	status: z.nativeEnum(RequestStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
	deadline: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});

export type UpsertShiftRequetBody = z.infer<typeof upsertShfitRequestValidate>;
