import prisma from "../config/database";

export const createStore = (name: string, groupId: string) => {
	return prisma.store.create({
		data: {
			name: name,
			groupId: groupId, ///　LIFFで取得したグループIDを保存
		},
	});
};

export const getStoreByGroupId = (groupId: string) => {
	return prisma.store.findFirst({
		where: { groupId: groupId },
	});
};

export const getStoreById = (id: string) => {
	return prisma.store.findMany({
		where: { id: id },
	});
};

export const updateStoreGroupId = (storeId: string, groupId: string) => {
	return prisma.store.update({
		where: { storeId: storeId },
		data: { groupId },
	});
};
