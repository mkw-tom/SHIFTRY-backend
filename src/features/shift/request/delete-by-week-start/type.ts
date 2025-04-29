import type { ShiftRequest } from "@prisma/client";

export interface DeleteShiftRequestResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}
