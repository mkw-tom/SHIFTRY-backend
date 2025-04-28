import type { User, UserRole } from "@prisma/client";
import prisma from "../config/database";

import type { updateUserProlfileType } from "../features/user/put/validation";
import type { UpsertUserInput } from "../types/user.types";

/// ✅ ユーザーの全取得
export const getUsers = async (): Promise<User[]> => {
	return await prisma.user.findMany();
};

/// ✅ userIdからユーザーの取得
export const getUserById = async (userId: string): Promise<User | null> => {
	return await prisma.user.findUnique({
		where: { id: userId },
	});
};

export const getUserByLineId = async (lineId: string): Promise<User | null> => {
	return await prisma.user.findUnique({
		where: { lineId: lineId },
	});
};

/// ユーザーの作成・更新
export const upsertUser = async (data: UpsertUserInput): Promise<User> => {
	return await prisma.user.upsert({
		where: { lineId: data.lineId },
		create: data,
		update: data,
	});
};

export const updateUser = async (
	userId: string,
	data: updateUserProlfileType,
): Promise<User> => {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
};

export const changeUserRole = async (
	userId: string,
	role: UserRole,
): Promise<User> => {
	return await prisma.user.update({
		where: { id: userId },
		data: {
			role: role as UserRole,
		},
	});
};

///✅ ユーザーの削除
export const deleteUser = async (userId: string): Promise<User> => {
	return prisma.user.delete({
		where: { id: userId },
	});
};
