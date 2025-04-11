import type { Store, User, UserStore } from "@prisma/client";
import {
	createStore,
	getStoreByGroupId,
} from "../repositories/store.repository";
import { getUserById, upsertUser } from "../repositories/user.repository";
import {
	createUserStore,
	getStoreFromUser,
	getUserStoreByUserId,
	getUserStoreByUserIdAndStoreId,
} from "../repositories/userStore.repository";
import type { lineAuthResponse } from "../types/auth.type";
import type { UpsertUserInput } from "../types/user.types";
import { verifyUser, verifyUserStore } from "./common/authorization.service";

export const lineAuth = async (code: string): Promise<lineAuthResponse> => {
	const params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("redirect_uri", process.env.LINE_AUTH_REDIRECT_URI as string);
	params.append("client_id", process.env.LINE_AUTH_CHANNEL_ID as string);
	params.append("client_secret", process.env.LINE_AUTH_CHANNEL_SECRE as string);

	const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params,
	});
	if (!tokenRes.ok) {
		throw new Error("トークン取得失敗");
	}

	const tokenData = await tokenRes.json();
	if (!tokenData.id_token) {
		throw new Error("LINEトークンの取得に失敗しました");
	}

	const userInfoRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			id_token: tokenData.id_token,
			client_id: process.env.LINE_AUTH_CHANNEL_ID as string,
		}),
	});
	if (!userInfoRes.ok) {
		throw new Error("LINEユーザー情報の取得に失敗");
	}

	const userInfo = await userInfoRes.json();
	const userId = userInfo.sub;

	const profileRes = await fetch("https://api.line.me/v2/profile", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${tokenData.access_token}`,
		},
	});

	if (!profileRes.ok) throw new Error("プロフィール取得に失敗");

	const profile = await profileRes.json();

	return {
		userId,
		name: profile.displayName,
		pictureUrl: profile.pictureUrl,
	};
};

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
