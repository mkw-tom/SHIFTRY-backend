import prisma from "../config/database";
import type { UserRole } from "../types/user.types";

export const createUserStore = async (
	userId: string,
	storeId: string,
	role: UserRole,
) => {
	return await prisma.userStore.create({
		data: {
			userId,
			storeId,
			role,
		},
	});
};

///　userIdから中間テーブルの店舗データを取得
export const getUserStoreByUserId = async (userId: string) => {
	return await prisma.userStore.findFirst({
		where: { userId },
		select: { storeId: true, role: true },
	});
};

export const getUserStoreByUserIdAndStoreId = async (
	userId: string,
	storeId: string,
) => {
	return await prisma.userStore.findFirst({
		where: { userId, storeId },
		select: { storeId: true, role: true },
	});
};
