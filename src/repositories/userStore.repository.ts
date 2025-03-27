import type { UserStore } from "@prisma/client";
import prisma from "../config/database";
import type { UserRole } from "../types/user.types";

export const createUserStore = async (
	userId: string,
	storeId: string,
	role: UserRole,
): Promise<UserStore> => {
	return await prisma.userStore.create({
		data: {
			userId,
			storeId,
			role,
		},
	});
};

///　userIdから中間テーブルの店舗データを取得
export const getUserStoreByUserId = async (
	userId: string,
): Promise<UserStore | null> => {
	return await prisma.userStore.findFirst({
		where: { userId },
		select: { userId: true, storeId: true, role: true },
	});
};

export const getUserStoreByUserIdAndStoreId = async (
	userId: string,
	storeId: string,
): Promise<UserStore | null> => {
	return await prisma.userStore.findFirst({
		where: { userId, storeId },
		select: { userId: true, storeId: true, role: true },
	});
};
