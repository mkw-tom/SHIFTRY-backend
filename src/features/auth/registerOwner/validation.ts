import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userInputValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
	role: z.nativeEnum(UserRole),
});
export type userInput = z.infer<typeof userInputValidate>;

export const storeInputValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
	groupId: z.string({ message: "Invalid groupId format" }).max(250),
});
