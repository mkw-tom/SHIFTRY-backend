import { RequestStatus } from "@prisma/client";
import { z } from "zod";

/// request　プロパティのJSONデータのバリエーション
const timeSlotSchema = z.object({
	time: z.string().min(1, { message: "time is required" }).max(50),
	required: z
		.number()
		.int()
		.min(1, { message: "required must be at least 1" })
		.max(10),
});
export const requestJsonSchema = z.object({
	monday: z.array(timeSlotSchema),
	tuesday: z.array(timeSlotSchema),
	wednesday: z.array(timeSlotSchema),
	thursday: z.array(timeSlotSchema),
	friday: z.array(timeSlotSchema),
	saturday: z.array(timeSlotSchema),
	sunday: z.array(timeSlotSchema),
});

// 型も自動で生成！
export type RequestJsonType = z.infer<typeof requestJsonSchema>;

export const upsertShfitRequestValidate = z.object({
	storeId: z.string(),
	weekStart: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	weekEnd: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	requests: requestJsonSchema,
	status: z.nativeEnum(RequestStatus, {
		errorMap: () => ({ message: "Invalid status" }),
	}),
	deadline: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
});

export type UpsertShiftRequetBody = z.infer<typeof upsertShfitRequestValidate>;
