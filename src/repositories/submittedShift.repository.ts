import { type Prisma, ShiftStatus, type SubmittedShift } from "@prisma/client";
import prisma from "../config/database";
import type { upsertSubmittedShiftInput } from "../features/shift/submit/post/validation";

export const upsertSubmittedShift = async (
	userId: string,
	storeId: string,
	data: upsertSubmittedShiftInput,
): Promise<SubmittedShift> => {
	return await prisma.submittedShift.upsert({
		where: {
			userId_shiftRequestId: {
				userId: userId,
				shiftRequestId: data.shiftRequestId,
			},
		},
		update: {
			shifts: data.shifts as Prisma.JsonObject,
			status: data.status,
		},
		create: {
			userId: userId,
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			shifts: data.shifts as Prisma.JsonObject,
			status: data.status,
		},
	});
};

export const getSubmittedShiftUser = async (
	userId: string,
	storeId: string,
): Promise<SubmittedShift[]> => {
	return await prisma.submittedShift.findMany({
		where: { userId, storeId },
	});
};

export const getSubmittedShiftsSpecific = async (
	shiftRequestId: string,
): Promise<SubmittedShift[]> => {
	return await prisma.submittedShift.findMany({
		where: { shiftRequestId },
	});
};
