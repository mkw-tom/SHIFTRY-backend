import type { User } from "@prisma/client";

export interface DeleteUserResponse {
	ok: true;
	deletedUser: User;
}
