import prisma from "../config/database";

import type { CreateUserInput, UpdateUserInput } from "../types/userTypes";

export const createUser = async (data: CreateUserInput) => {
	return prisma.user.upsert({
		where: { lineId: data.lineId },
		create: data,
		update: data,
	});
};

export const fetchUsers = async () => {
	return prisma.user.findMany();
};

export const updateUser = async (userId: string, data: UpdateUserInput) => {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
};

export const deleteUser = async (userId: string) => {
	return prisma.user.delete({
		where: { id: userId },
	});
};

//// ----　　✅　中間テーブルにユーザーデータを追加 --------------------0
// ✔︎ オーナーの中間データを作成
export const createDataOwnerToStore = async (
	ownerId: string,
	storeId: string,
) => {
	return prisma.ownerStore.create({
		data: {
			ownerId: ownerId,
			storeId: storeId,
		},
	});
};

// ✔︎　オーナーの中間データを作成
export const createDataStaffToStore = async (
	userId: string,
	storeId: string,
) => {
	return prisma.userStore.create({
		data: {
			userId: userId,
			storeId: storeId,
		},
	});
};
