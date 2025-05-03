import type { UserRole, UserStore } from "../../../../types/prisma";

export const mockUserStore = (
	userId: string,
	storeId: string,
	role: UserRole,
): UserStore => ({
	userId: userId,
	storeId: storeId,
	role: role,
});
