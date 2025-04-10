import type { UserRole } from "@prisma/client";
import { changeUserRole } from "../repositories/user.repository";
import { changeUserRoleToUserStore } from "../repositories/userStore.repository";

/// ユーザーの権限変更（オーナーが操作）
export const changeUserRoleService = async (
	userId: string,
	storeId: string,
	role: UserRole,
) => {
	return await Promise.all([
		changeUserRole(userId, role),
		changeUserRoleToUserStore(userId, storeId, role),
	]);
};
