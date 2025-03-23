import prisma from "../config/database";

export const createStore = async (name: string, groupId: string) => {
	return await prisma.store.create({
		data: {
			name: name,
			groupId: groupId, ///　LIFFで取得したグループIDを保存
		},
	});
};

export const getStoreByGroupId = async (groupId: string) => {
	return await prisma.store.findFirst({
		where: { groupId: groupId },
	});
};

export const getStoreById = async (id: string) => {
	return await prisma.store.findMany({
		where: { id: id },
	});
};

export const updateStoreGroupId = async (storeId: string, groupId: string) => {
	return await prisma.store.update({
		where: { storeId: storeId },
		data: { groupId },
	});
};
