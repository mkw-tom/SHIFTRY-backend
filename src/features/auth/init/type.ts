import type { ShiftRequest, Store, User } from "@prisma/client";

export interface InitServiceResponse {
	user: User;
	store: Store;
	shiftRequest: ShiftRequest[] | [];
}
export interface InitResponse {
	ok: true;
	user: User;
	store: Store;
	shiftRequest: ShiftRequest[];
	user_token: string;
	store_token: string;
	group_token: string;
}
