import type { User } from "@prisma/client";

export interface DeleteUserByOwnerResponse {
	ok: true;
	deleteStaff: User;
}
