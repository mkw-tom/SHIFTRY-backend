import type { Store, User, UserRole, UserStore } from "@prisma/client";
import type { ZodIssue } from "zod";

// ok: true, user, store, user_token, store_token, group_token
export interface RegisterStaffResponse {
	ok: true;
	user: User;
	store: Store;
	userStore: UserStore;
	user_token: string;
	store_token: string;
	group_token: string;
}

export interface RegisterStaffServiceResponse {
	user: User;
	store: Store;
	userStore: UserStore;
}

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}
