import type { ShiftRequest } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface UpsertShiftRequetResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}

export interface UpsertShiftRepuestValidationErrorResponse {
	ok: false;
	message: string;
	errors: ZodIssue[];
}
