import type { SubmittedShift } from "@prisma/client";

export interface UpsertSubmittedShfitResponse {
	ok: true;
	submittedShift: SubmittedShift;
}
