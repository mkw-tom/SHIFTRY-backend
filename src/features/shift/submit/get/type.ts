import type { SubmittedShift } from "@prisma/client";

export interface GetSubmittedShiftUserResponse {
	ok: true;
	submittedShifts: SubmittedShift[];
}
