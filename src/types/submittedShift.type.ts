import type { ShiftStatus } from "@prisma/client";

export interface upsertSubmittedShiftinput {
	userId: string;
	storeId: string;
	shiftRequestId: string;
	weekStart: string;
	weekEnd: string;
	shifts: string[];
	status: ShiftStatus;
	attendCount: number;
}
