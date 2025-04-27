import type { ShiftRequest } from "@prisma/client";

export interface GetShiftRequestSpecificResponse {
	ok: true;
	shiftRerquest: ShiftRequest;
}
