import prisma from "../config/database";
import type { UserRole } from "../types/user.types";

export const createUserStore = (
	userId: string,
	storeId: string,
	role: UserRole,
) => {
	return prisma.userStore.create({
		data: {
			userId,
			storeId,
			role,
		},
	});
};

///　userIdから中間テーブルの店舗データを取得
export const getUserStoreByUserId = (userId: string) => {
	return prisma.userStore.findFirst({
		where: { userId },
		select: { storeId: true, role: true },
	});
};

export const getUserStoreByUserIdAndStoreId = (
	userId: string,
	storeId: string,
) => {
	return prisma.userStore.findFirst({
		where: { userId, storeId },
		select: { storeId: true, role: true },
	});
};
