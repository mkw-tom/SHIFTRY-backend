import {
	createStore,
	getStoreByGroupId,
	getStoreById,
} from "../repositories/store.repository";
import { getUserById, upsertUser } from "../repositories/user.repository";
import {
	createUserStore,
	getUserStoreByUserId,
	getUserStoreByUserIdAndStoreId,
} from "../repositories/userStore.repository";
import type { UpsertUserInput } from "../types/user.types";

export const authMe = async (userId: string) => {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");

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
) => {
	const user = await upsertUser(userInput);
	if (!user) throw new Error("Failed to create user");

	// store作成
	const store = await createStore(storeInput.name, storeInput.groupId);
	if (!store) throw new Error("Failed to create store");

	// userStoreにオーナー登録
	await createUserStore(user.id, store.id, "OWNER");

	return { user, store };
};

export const registerStaff = async (
	userInput: UpsertUserInput,
	groupId: string,
) => {
	const store = await getStoreByGroupId(groupId);
	if (!store || !store.storeId) throw new Error("Store not found");
	const user = await upsertUser(userInput);
	if (!user) throw new Error("Failed to create user");

	await createUserStore(user.id, store.id, "STAFF");

	return { user, store };
};

///　通常ログイン
export const login = async (userId: string) => {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");

	const userStore = await getUserStoreByUserId(userId);
	if (!userStore) throw new Error("User is not associated with a store");

	const store = await getStoreById(userStore.storeId);
	if (!store) throw new Error("Store not found");

	return { user, store };
};

/// 店舗データに即ログイン　　（シフト提出・確定通知リンクからのログイン）
export const storeLogin = async (userId: string, groupId: string) => {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");

	const store = await getStoreByGroupId(groupId);
	if (!store) throw new Error("Store not found");

	const userStore = await getUserStoreByUserIdAndStoreId(user.id, store.id);
	if (!userStore) throw new Error("User is not associated with this store");

	return { user, store };
};
