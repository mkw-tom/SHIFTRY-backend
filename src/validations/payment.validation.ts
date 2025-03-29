import { z } from "zod";

export const priceIdValidate = z.object({
	priceId: z.string().min(1, "priceId is required").max(100),
});

export const changePlanValidate = z.object({
	priceId: z.string().min(1, "priceId is required").max(100),
	plan: z.string().min(1, "plan name is required").max(100),
});

export type ChangePlanInput = z.infer<typeof changePlanValidate>;
