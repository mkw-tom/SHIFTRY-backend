import prisma from "../config/database";
import type { upsertAssignShfitInput } from "../validations/assignShift.validation";

export const upsertAssignShfit = async (
	storeId: string,
	data: upsertAssignShfitInput,
) => {
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

export const getAssignShift = async (shiftRequestId: string) => {
	return await prisma.assignShift.findUnique({
		where: { shiftRequestId },
	});
};
