import type { ShiftRequest } from "@prisma/client";

export interface GetShiftRequestResponse {
	ok: true;
	shiftRequests: ShiftRequest[];
}
