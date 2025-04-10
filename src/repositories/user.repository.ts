import type { User, UserRole } from "@prisma/client";
import prisma from "../config/database";

import type { UpdateUserInput, UpsertUserInput } from "../types/user.types";
import type { updateUserProlfileType } from "../validations/user.validation";

/// ✅ ユーザーの全取得
export const getUsers = async (): Promise<User[] | [] | null> => {
	return await prisma.user.findMany();
};

/// ✅ userIdからユーザーの取得
export const getUserById = async (userId: string): Promise<User | null> => {
	return await prisma.user.findUnique({
		where: { id: userId },
	});
};

/// ユーザーの作成・更新
export const upsertUser = async (
	data: UpsertUserInput,
): Promise<User | null> => {
	return await prisma.user.upsert({
		where: { lineId: data.lineId },
		create: data,
		update: data,
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
export const updateUser = async (
	userId: string,
	data: updateUserProlfileType,
) => {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
};

export const changeUserRole = async (userId: string, role: UserRole) => {
	return await prisma.user.update({
		where: { id: userId },
		data: {
			role: role as UserRole,
		},
	});
};

///✅ ユーザーの削除
export const deleteUser = async (userId: string) => {
	return prisma.user.delete({
		where: { id: userId },
	});
};
