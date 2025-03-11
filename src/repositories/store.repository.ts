import prisma from "../config/database";
import type { createStoreType } from "../types/storeType";

/////////////-------------------　storeテーブル　-----------------/////////////////////
export const getStores = async () => {
	return prisma.store.findMany();
};

export const createStore = async (data: createStoreType) => {
	return prisma.store.create({ data });
};

export const updateStoreName = async (storeId: string, name: string) => {
	return prisma.store.update({
		where: { id: storeId },
		data: { name: name },
	});
};

export const deleteStore = async (storeId: string) => {
	return prisma.store.delete({
		where: { id: storeId },
	});
};
/////////////---------　中間テーブル(userStore ownerStore)　-------/////////////////////

export const getStoreStaffs = async (storeId: string) => {
	return prisma.userStore.findMany({
		where: { storeId: storeId },
		include: {
			user: true, // user テーブルをJOINして、user情報を取得
		},
	});
};

export const getStoresByOwner = async (ownerId: string) => {
	return prisma.ownerStore.findMany({
		where: { ownerId: ownerId },
		include: {
			store: true, // user テーブルをJOINして、user情報を取得
		},
	});
};

export const isOwnerStore = async (storeId: string, ownerId: string) => {
	return prisma.ownerStore.findFirst({
		where: { ownerId: ownerId, storeId: storeId },
	});
	/// データがある場合：{ ownerId: "xxxxxxx", storeId: "yyyyyy" }
	/// データがない場合： null
};

export const isUserStore = async (storeId: string, userId: string) => {
	return prisma.userStore.findFirst({
		where: { userId: userId, storeId: storeId },
	});
	/// データがある場合：{ userId: "xxxxxxx", storeId: "yyyyyy" }
	/// データがない場合： null
};

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
