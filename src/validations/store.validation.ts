import { z } from "zod";

export const connectGoupIdValidate = z.object({
	groupId: z.string({ message: "Invalid groupId format" }).max(250),
});

export const storeInputValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
	groupId: z.string({ message: "Invalid groupId format" }).max(250),
});
export type StoreInput = z.infer<typeof storeInputValidate>;

export const updateStoreNameValidate = z.object({
	name: z.string().min(1, { message: "store name is required" }).max(20),
});
export type updateStoreNameInput = z.infer<typeof updateStoreNameValidate>;
