import type { User } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface UpdateUserProfileResponse {
	ok: true;
	updatedUser: User;
}

export interface UpdateUserProfileValidationErrorResponse {
	ok: false;
	message: string;
	errors: {
		user: ZodIssue[];
	};
}
