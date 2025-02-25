export interface User {
	id: string;
	lineId: string;
	name: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export type UserRole = "OWNER" | "STAFF";

export interface CreateUserInput {
	lineId: string;
	name: string;
	role: UserRole;
}

export interface UpdateUserInput {
	name?: string;
	role?: "OWNER" | "STAFF";
}
