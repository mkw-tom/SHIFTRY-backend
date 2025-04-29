import type { User, UserStore } from "@prisma/client";
import type { ZodIssue } from "zod";

export interface ChangeUserRoleResponse {
	ok: true;
	user: User;
	userStore: UserStore;
}

export interface ChangeUserRoleServiceResponse {
	user: User;
	userStore: UserStore;
}
