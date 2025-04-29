import type { ShiftRequest } from "@prisma/client";

export interface UpsertShiftRequetResponse {
	ok: true;
	shiftRequest: ShiftRequest;
}
