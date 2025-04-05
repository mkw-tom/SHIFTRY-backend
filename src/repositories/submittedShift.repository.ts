import { ShiftStatus } from "@prisma/client";
import prisma from "../config/database";
import type { upsertSubmittedShiftInput } from "../validations/submittedShift.vaidation";

export const upsertSubmittedShift = async (
	userId: string,
	storeId: string,
	data: upsertSubmittedShiftInput,
) => {
	return await prisma.submittedShift.upsert({
		where: {
			userId_shiftRequestId: {
				userId: userId,
				shiftRequestId: data.shiftRequestId,
			},
		},
		update: {
			attendCount: data.attendCount,
			shifts: data.shifts,
			status: data.status,
		},
		create: {
			userId: userId,
			storeId: storeId,
			shiftRequestId: data.shiftRequestId,
			attendCount: data.attendCount,
			shifts: data.shifts,
			status: data.status,
		},
	});
};

export const getSubmittedShiftUser = async (
	userId: string,
	storeId: string,
) => {
	return await prisma.submittedShift.findMany({
		where: { userId, storeId },
	});
};

export const getWeeklySubmittedShifts = async (shiftRequestId: string) => {
	return await prisma.submittedShift.findMany({
		where: { shiftRequestId },
	});
};
