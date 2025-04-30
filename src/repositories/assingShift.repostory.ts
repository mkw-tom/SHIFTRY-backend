import type { AssignShift } from "@prisma/client";
import prisma from "../config/database";
import type { upsertAssignShfitInputType } from "../features/shift/assign/put/validation";

export const upsertAssignShfit = async (
	storeId: string,
	data: upsertAssignShfitInputType,
): Promise<AssignShift> => {
	return await prisma.assignShift.upsert({
		where: { shiftRequestId: data.shiftRequestId },
		update: {
			shifts: data.shifts,
			status: data.status,
		},
		create: {
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			shifts: data.shifts,
			status: data.status,
		},
	});
};

export const getAssignShift = async (
	shiftRequestId: string,
): Promise<AssignShift | null> => {
	return await prisma.assignShift.findUnique({
		where: { shiftRequestId },
	});
};
