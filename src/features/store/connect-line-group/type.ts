import type { Store } from "@prisma/client";

export interface StoreConnectLineGroupResponse {
	ok: true;
	store: Store;
	group_token: string;
}
