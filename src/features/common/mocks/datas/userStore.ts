import type { UserRole, UserStore } from "@prisma/client";

export const mockUserStore = (
	userId: string,
	storeId: string,
	role: UserRole,
): UserStore => ({
	userId: userId,
	storeId: storeId,
	role: role,
});
