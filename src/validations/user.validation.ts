import { UserRole } from "@prisma/client";
import { z } from "zod";

export const updateUserProlfileValidate = z.object({
	name: z.string().min(1, { message: "name is required" }).max(20),
	pictureUrl: z.string().url().optional(),
});
export type updateUserProlfileType = z.infer<typeof updateUserProlfileValidate>;

export const changeUserRoleValidate = z.object({
	userId: z.string().uuid(),
	role: z.enum(["STAFF", "MANAGER"]), // ← OWNERは除外！
});

export type changeUserRoleInput = z.infer<typeof changeUserRoleValidate>;
