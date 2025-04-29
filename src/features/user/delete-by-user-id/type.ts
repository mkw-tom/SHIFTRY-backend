import type { User } from "@prisma/client";

export interface DeleteUserResponse {
	ok: true;
	deleteStaff: User;
}
