import type { LineUser } from "../types/lineType";
import { User, type UserRole } from "../types/userTypes";
import { sendGroupMessage } from "./lineMessage.service";
import { getUserProfile, isUserInGroup } from "./lineUser.service";
import {
	createDataOwnerToStore,
	createDataStaffToStore,
} from "./store.service";
import { createUser } from "./user.service";

export const isUserAndGetProfile = async (
	groupId: string,
	userId: string,
): Promise<LineUser> => {
	const isUser = await isUserInGroup(groupId, userId);
	if (!isUser) {
		throw new Error("オーナーの認証に失敗しました");
	}

	//オーナーのプロフィールを取得
	const userProfile = await getUserProfile(groupId, userId);
	if (!userProfile) {
		throw new Error("オーナープロファイルの取得に失敗しました");
	}

	return userProfile;
};

export const createLoginUserData = async (
	userProfile: LineUser,
	storeId: string,
	role: UserRole,
) => {
	// ✅ ユーザーを作成（既に存在する場合は上書きされない）
	const user = await createUser({
		lineId: userProfile.userId,
		name: userProfile.displayName,
		pictureUrl: userProfile.pictureUrl,
		role: role,
	});

	if (!user) {
		console.log("❌ ユーザー登録に失敗しました");
		throw new Error("ユーザー登録に失敗しました");
	}

	// ✅ オーナーまたはスタッフとして店舗に紐付ける
	const storeAssociation =
		role === "OWNER"
			? await createDataOwnerToStore(userProfile.userId, storeId)
			: await createDataStaffToStore(userProfile.userId, storeId);
	if (!storeAssociation) {
		throw new Error(`${role} の店舗登録に失敗しました`);
	}
	return user;
};

export const sendStaffLoginMessage = async (groupId: string): Promise<void> => {
	try {
		const staffLoginMessage =
			"スタッフの皆さんにお願いです📢\n\n以下のリンクからスタッフ登録をお願いします！\n\n🔹 スタッフ登録画面\n👉 https://qiita.com";
		await sendGroupMessage(groupId, staffLoginMessage);
	} catch (error) {
		throw new Error("スタッフ登録メッセージの送信に失敗しました");
	}
};
