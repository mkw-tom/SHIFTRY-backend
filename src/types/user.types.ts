// import { UserRole } from "@prisma/client";

export interface User {
	id: string;
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export type UserRole = "OWNER" | "STAFF" | "MANAGER";

export interface UpsertUserInput {
	lineId: string;
	name: string;
	pictureUrl?: string;
	role: UserRole;
}

export interface UpdateUserInput {
	name?: string;
	pictureUrl?: string;
	role?: "OWNER" | "STAFF";
}

export interface LineUser {
	displayName: string;
	userId: string; // LINEのユーザーID (userId)  例: U4af4980629...
	language: string;
	pictureUrl: string;
	statusMessage: string;
}
