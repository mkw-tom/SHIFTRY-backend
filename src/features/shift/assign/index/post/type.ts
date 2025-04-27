import type { AssignShift } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface UpsertAssigShiftResponse {
	ok: true;
	assignShift: AssignShift;
}

export interface UpsertAssignShiftValidationErrorResponse {
	ok: false;
	message: string;
	errors: ZodIssue[];
}
