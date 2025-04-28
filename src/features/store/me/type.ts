import type { Store } from "@prisma/client";

export interface GetStoresFromUserResponse {
	ok: true;
	stores: Store[];
}
