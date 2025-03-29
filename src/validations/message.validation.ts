import { z } from "zod";

export const pushMessageValidate = z.object({
	groupId: z.string().max(250),
});
export type pushMessageInput = z.infer<typeof pushMessageValidate>;
