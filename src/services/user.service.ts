import prisma from "../config/database";
import { MemberInfo } from "../types/authType";
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

// ❌ ユーザー(スタッフ・オーナー)を登録
// export const registerUsers = async (
// 	membersInfo: MemberInfo[],
// 	ownerLineId: string,
// ) => {
// 	if (!membersInfo || membersInfo.length === 0) {
// 		console.log("⚠️ ユーザー情報が空または無効のため、登録をスキップします。");
// 		return;
// 	}

// 	return await prisma.user.createMany({
// 		data: membersInfo.map((member) => ({
// 			lineId: member.lineId,
// 			name: member.name,
// 			pictureUrl: member.pictureUrl,
// 			role: member.lineId === ownerLineId ? "OWNER" : "STAFF",
// 		})),
// 		skipDuplicates: true,
// 	});
// };
