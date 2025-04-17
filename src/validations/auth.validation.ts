import { z } from "zod";

import { UserRole } from "@prisma/client"; // ← enumをそのまま使える！

export const reLoginUserIdValidate = z.object({
	userId: z.string().max(250),
});

export const userInputValidate = z.object({
	// lineId: z.string().min(1, { message: "lineId is required" }).max(250),
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
	role: z.nativeEnum(UserRole),
});
export type userInput = z.infer<typeof userInputValidate>;

export const storeIdValidate = z.object({
	storeId: z.string({ message: "Invalid storeId format" }).uuid(),
});

export const storeIdandShfitReruestIdValidate = z.object({
	storeId: z.string({ message: "Invalid storeId format" }).uuid(),
	shiftRequestId: z.string({ message: "Invalid shiftRequestId format" }).uuid(),
});
export type storeIdandShfitReruestIdType = z.infer<
	typeof storeIdandShfitReruestIdValidate
>;
