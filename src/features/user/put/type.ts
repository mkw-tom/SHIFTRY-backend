import type { User } from "@prisma/client";

export interface UpdateUserProfileResponse {
	ok: true;
	updatedUser: User;
}
