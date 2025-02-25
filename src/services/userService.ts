import prisma from "../config/database";
import type { CreateUserInput, UpdateUserInput } from "../types/userTypes";

export const createUser = async (data: CreateUserInput) => {
	return prisma.user.create({ data });
};

export const fetchUsers = async () => {
	return prisma.user.findMany();
};

export const editUser = async (userId: string, data: UpdateUserInput) => {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
};

export const removeUser = async (userId: string) => {
	return prisma.user.delete({
		where: { id: userId },
	});
};
