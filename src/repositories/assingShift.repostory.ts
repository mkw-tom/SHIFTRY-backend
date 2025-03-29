import prisma from "../config/database";
import type { upsertAssignShfitInput } from "../validations/assignShift.validation";

export const upsertAssignShfit = async (
	storeId: string,
	data: upsertAssignShfitInput,
) => {
	return await prisma.assignShift.upsert({
		where: {
			storeId_weekStart: {
				storeId: storeId,
				weekStart: new Date(data.weekStart),
			},
		},
		update: {
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
			shifts: data.shifts,
			status: data.status,
		},
		create: {
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
			shifts: data.shifts,
			status: data.status,
		},
	});
};

export const getAssignShift = async (storeId: string, weekStart: string) => {
	return await prisma.assignShift.findUnique({
		where: {
			storeId_weekStart: {
				storeId,
				weekStart: new Date(weekStart),
			},
		},
	});
};
