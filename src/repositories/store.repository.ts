import type { Store } from "@prisma/client";
import prisma from "../config/database";

export const createStore = async (
	name: string,
	groupId: string,
): Promise<Store> => {
	return await prisma.store.create({
		data: {
			name: name,
			groupId: groupId, ///　LIFFで取得したグループIDを保存
		},
	});
};

export const getStoreByGroupId = async (
	groupId: string,
): Promise<Store | null> => {
	return await prisma.store.findFirst({
		where: { groupId: groupId },
	});
};

export const getStoreById = async (
	id: string,
): Promise<Store[] | [] | null> => {
	return await prisma.store.findMany({
		where: { id: id },
	});
};

export const updateStoreGroupId = async (
	id: string,
	groupId: string,
): Promise<Store | null> => {
	return await prisma.store.update({
		where: { id },
		data: { groupId: groupId },
	});
};
