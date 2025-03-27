import { ShiftStatus } from "@prisma/client";
import prisma from "../config/database";
import type { upsertSubmittedShiftInput } from "../validations/submittedShift.vaidation";

export const upsertSubmittedShift = async (
	userId: string,
	data: upsertSubmittedShiftInput,
) => {
	return await prisma.submittedShift.upsert({
		where: {
			userId_storeId_weekStart: {
				userId: userId,
				storeId: data.storeId,
				weekStart: new Date(data.weekStart),
			},
		},
		update: {
			storeId: data.storeId,
			attendCount: data.attendCount,
			shifts: data.shifts,
			status: data.status,
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
		},
		create: {
			userId: userId,
			storeId: data.storeId,
			shiftRequestId: data.shiftRequestId,
			attendCount: data.attendCount,
			shifts: data.shifts,
			weekStart: new Date(data.weekStart),
			weekEnd: new Date(data.weekEnd),
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

export const getWeeklySubmittedShifts = async (
	storeId: string,
	weekStart: string,
) => {
	return await prisma.submittedShift.findMany({
		where: { storeId, weekStart: new Date(weekStart) },
	});
};
