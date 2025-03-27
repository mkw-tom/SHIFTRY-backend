import { z } from "zod";

import { UserRole } from "@prisma/client"; // ← enumをそのまま使える！

export const reLoginUserIdValidate = z.object({
	userId: z.string().max(250),
});

export const userInputValidate = z.object({
	lineId: z.string().min(1, { message: "lineId is required" }).max(250),
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
	role: z.nativeEnum(UserRole),
});
export type userInput = z.infer<typeof userInputValidate>;

export const storeInputValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
	groupId: z.string({ message: "Invalid groupId format" }).max(250),
});
export type StoreInput = z.infer<typeof storeInputValidate>;

export const groupIdValidate = z.object({
	groupId: z.string({ message: "Invalid groupId format" }).max(250),
});
