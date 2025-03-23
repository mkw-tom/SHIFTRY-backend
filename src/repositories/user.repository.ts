import prisma from "../config/database";

import type { UpdateUserInput, UpsertUserInput } from "../types/user.types";

/// ✅ userIdからユーザーの取得
export const getUserById = async (userId: string) => {
	return prisma.user.findUnique({
		where: { id: userId },
	});
};

/// ユーザーの作成・更新
export const upsertUser = async (data: UpsertUserInput) => {
	return prisma.user.upsert({
		where: { lineId: data.lineId },
		create: data,
		update: data,
	});
};

/// ✅ ユーザーの全取得
export const getUsers = async () => {
	return prisma.user.findMany();
};

/// ✅✅ ログインで使うかも　店舗のユーザー取得
export const getUserAndStore = async (storeId: string, userId: string) => {
	return prisma.userStore.findFirst({
		where: { storeId, userId },
		include: {
			user: true,
			store: true,
		},
	});
};

/// ✅ 店舗に紐づくユーザーを取得　　（中間テーブル : userStore）
export const getStoreUser = async (storeId: string) => {
	return prisma.userStore.findMany({
		where: { storeId: storeId },
		include: {
			user: true, // user テーブルをJOINして、user情報を取得
		},
	});
};

///　✅ ユーザーのプロフィール編集（role name）
export const updateUser = async (userId: string, data: UpdateUserInput) => {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
};

///✅ ユーザーの削除
export const deleteUser = async (userId: string) => {
	return prisma.user.delete({
		where: { id: userId },
	});
};
// export const fetchUsers = async () => {
// 	return prisma.user.findMany();
// };

//// ----　　✅　中間テーブルにユーザーデータを追加 --------------------0
// ✔︎ オーナーの中間データを作成
// export const createDataOwnerToStore = async (
// 	ownerId: string,
// 	storeId: string,
// ) => {
// 	return prisma.ownerStore.create({
// 		data: {
// 			ownerId: ownerId,
// 			storeId: storeId,
// 		},
// 	});
// };

// // ✔︎　オーナーの中間データを作成
// export const createDataStaffToStore = async (
// 	userId: string,
// 	storeId: string,
// ) => {
// 	return prisma.userStore.create({
// 		data: {
// 			userId: userId,
// 			storeId: storeId,
// 		},
// 	});
// };
