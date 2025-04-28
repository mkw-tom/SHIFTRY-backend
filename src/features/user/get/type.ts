import type { User } from "@prisma/client";

export interface GetUsersFromStoreResponse {
	ok: true;
	storeUsers: User[];
}
