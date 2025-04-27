import type { User } from "@prisma/client";

export interface GetUserFromStoreResponse {
	ok: true;
	storeUsers: User[];
}
