import { Prisma, ShiftStatus } from "@prisma/client";
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
) => {
	return await prisma.submittedShift.findMany({
		where: { userId, storeId },
	});
};

export const getSubmittedShiftsSpecific = async (shiftRequestId: string) => {
	return await prisma.submittedShift.findMany({
		where: { shiftRequestId },
	});
};
