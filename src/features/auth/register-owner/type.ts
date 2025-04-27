import type { Store, User, UserRole } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface RegisterOwnerResponse {
	ok: true;
	user: User;
	store: Store;
	user_token: string;
	store_token: string;
}

export interface RegisterOwnerServiceResponse {
	user: User;
	store: Store;
}

export interface RegisterOwnerValidationErrorResponse {
	ok: false;
	message: string;
	errors: {
		user?: ZodIssue[];
		store?: ZodIssue[];
	};
}

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}
