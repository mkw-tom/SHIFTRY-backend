import type { Store } from "@prisma/client";
import { string } from "zod";
import prisma from "../config/database";
import { updateStoreNameInput } from "../validations/store.validation";

export const createStore = async (
	name: string,
	groupId: string,
): Promise<Store> => {
	return await prisma.store.create({
		data: {
			name: name,
			groupId: groupId,
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
	storeId: string,
	groupId: string,
): Promise<Store | null> => {
	return await prisma.store.update({
		where: { id: storeId },
		data: { groupId: groupId },
	});
};

export const updateStoreName = async (
	storeId: string,
	name: string,
): Promise<Store> => {
	return await prisma.store.update({
		where: { id: storeId },
		data: {
			name: name,
		},
	});
};

// 店舗削除
export const deleteStore = async (id: string) => {
	return await prisma.store.delete({
		where: { id },
	});
};
