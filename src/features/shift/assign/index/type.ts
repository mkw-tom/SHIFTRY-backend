import type { AssignShift } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface AssigShiftResponse {
	ok: true;
	assignShift: AssignShift;
}

export interface UpsertAssignShiftValidationErrorResponse {
	ok: false;
	message: string;
	errors: ZodIssue[];
}
