import type { Store, User, UserStore } from "@prisma/client";
import {
	createStore,
	getStoreByGroupId,
	getStoreById,
} from "../repositories/store.repository";
import { getUserById, upsertUser } from "../repositories/user.repository";
import {
	createUserStore,
	getStoreFromUser,
	getUserStoreByUserId,
	getUserStoreByUserIdAndStoreId,
} from "../repositories/userStore.repository";
import type { UpsertUserInput } from "../types/user.types";
import { verifyUser, verifyUserStore } from "./common/authorization.service";

export const authMe = async (userId: string) => {
	const user = await verifyUser(userId);

	const userStore = await getUserStoreByUserId(userId);
	if (!userStore) throw new Error("User is not linked to any store");

	return {
		id: user.id,
		name: user.name,
		role: userStore.role,
		storeId: userStore.storeId,
	};
};

export const registerOwner = async (
	userInput: UpsertUserInput,
	storeInput: { name: string; groupId: string },
): Promise<{ user: User; store: Store }> => {
	const user = await upsertUser(userInput);
	if (!user) throw new Error("Failed to create user");

	// store作成
	const store = await createStore(storeInput.name, storeInput.groupId);
	if (!store) throw new Error("Failed to create store");

	// userStoreにオーナー登録
	const userStore = await createUserStore(user.id, store.id, "OWNER");

	return { user, store };
};

export const registerStaff = async (
	userInput: UpsertUserInput,
	groupId: string,
): Promise<{ user: User; store: Store }> => {
	const store = await getStoreByGroupId(groupId);
	if (!store || !store.storeId) throw new Error("Store not found");
	const user = await upsertUser(userInput);
	if (!user) throw new Error("Failed to create user");

	await createUserStore(user.id, store.id, "STAFF");

	return { user, store };
};

///　通常ログイン
export const login = async (
	userId: string,
): Promise<{ user: User; stores: Store[] }> => {
	const user = await verifyUser(userId);

	const stores = (await getStoreFromUser(userId)).map((s) => s.store);

	// const store = await getStoreById(userStore.storeId);
	if (!stores) throw new Error("Store not found");

	return { user, stores };
};

/// 店舗データに即ログイン　　（シフト提出・確定通知リンクからのログイン）
export const storeLogin = async (
	userId: string,
	groupId: string,
): Promise<{ user: User; store: Store }> => {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");

	const store = await getStoreByGroupId(groupId);
	if (!store) throw new Error("Store not found");

	await verifyUserStore(user.id, store.id);

	return { user, store };
};
