import type { Store, User, UserRole } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface RegisterStaffServiceResponse {
	user: User;
	store: Store;
}

export interface BodyErrorResponse {
	ok: false;
	message: string;
	errors: {
		user?: ZodIssue[];
	};
}

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}
