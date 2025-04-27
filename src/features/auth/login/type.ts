import type { Store, User } from "@prisma/client";

export interface LoginServiceResponse {
	user: User;
	stores: Store[];
}

export interface LoginResponse {
	ok: true;
	user: User;
	stores: Store[];
}
