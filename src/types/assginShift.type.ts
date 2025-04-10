export type AssignData = {
	[key: string]: { time: string; user: string[] }[];
};

export type ShiftStatus = "ADJUSTMENT" | "CONFIRMED";

export interface UpsertAssignShiftInput {
	storeId: string;
	shiftRequestId: string;
	weekStart: string;
	weekEnd: string;
	shifts: AssignData;
	status: ShiftStatus;
}

export type AssignShifts = {
	[userId: string]: { date: string; time: string }[];
};
