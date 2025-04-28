import type { AssignShift } from "@prisma/client";
import prisma from "../config/database";
import type { upsertAssignShfitInput } from "../features/shift/assign/index/post/validation";

export const upsertAssignShfit = async (
	storeId: string,
	data: upsertAssignShfitInput,
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
