import type { SubmittedShift } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface UpsertSubmittedShfitResponse {
	ok: true;
	submittedShift: SubmittedShift;
}

export interface UpsertSubmittedShfitValidationErrorResponse {
	ok: false;
	message: string;
	errors: ZodIssue[];
}
