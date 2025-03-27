import prisma from "../config/database";
import type { upsertAssignShfitInput } from "../validations/assignShift.validation";

export const upsertAssignShfit = async (data: upsertAssignShfitInput) => {
	return await prisma.assignShift.upsert({
		where: {
			storeId_weekStart: {
				storeId: data.storeId,
				weekStart: new Date(data.weekStart),
			},
		},
		update: {
			storeId: data.storeId,
			shiftRequestId: data.shiftRequestId,
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
			shifts: data.shifts,
			status: data.status,
		},
		create: {
			storeId: data.storeId,
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
