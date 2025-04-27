import type { SubmittedShift } from "@prisma/client";

export interface GetSubmittedShiftsSpecificResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
