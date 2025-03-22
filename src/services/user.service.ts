// import {
// 	createUser,
// } from "../repositories/user.repository";
// import type { CreateUserInput, LineUser, UserRole } from "../types/user.types";

// /// ✅　初回ログイン時のデータ追加 & メッセージ送信
// // export const firstLoginUserFunc = async (
// // 	userProfile: LineUser,
// // 	storeId: string,
// // 	role: UserRole,
// // ) => {
// // 	try {
// // 		await createLoginUserData(userProfile, storeId, role);

// // 		// if (role === "OWNER") {
// // 		// 	await sendStaffLoginMessage(groupId);
// // 		// }
// // 	} catch (error) {
// // 		throw new Error("faild create user data");
// // 	}
// // };

// /// ----------------------------- 単体API--------------------------------
// // ☑️ 初回ログインユーザーのデータ作成
// export const createLoginUserData = async (
// 	userProfile: LineUser,
// 	storeId: string,
// 	role: UserRole,
// ) => {
// 	const data: CreateUserInput = {
// 		lineId: userProfile.userId,
// 		name: userProfile.displayName,
// 		pictureUrl: userProfile.pictureUrl,
// 		role: role,
// 	};

// 	const user = await createUser(data);
// 	if (!user) {
// 		throw new Error("ユーザー登録に失敗しました");
// 	}
// 	// オーナーまたはスタッフとして店舗に紐付ける
// 	// const storeAssociation =
// 	// 	role === "OWNER"
// 	// 		? await createDataOwnerToStore(userProfile.userId, storeId)
// 	// 		: await createDataStaffToStore(userProfile.userId, storeId);
// 	// if (!storeAssociation) {
// 	// 	throw new Error(`${role} の店舗登録に失敗しました`);
// 	// }
// 	return user;
// };

// //　☑️ オーナーが初回ログイン時に、グループにスタッフ登録URLを送信
// // export const sendStaffLoginMessage = async (groupId: string): Promise<void> => {
// // 	try {
// // 		const staffLoginMessage =
// // 			"スタッフの皆さんにお願いです📢\n\n以下のリンクからスタッフ登録をお願いします！\n\n🔹 スタッフ登録画面\n👉 https://qiita.com";

// // 		const response = await apiClient.post("/v2/bot/message/push", {
// // 			to: groupId, // グループID
// // 			messages: [{ type: "text", text: staffLoginMessage }], // 送信メッセージ
// // 		});
// // 		console.log("✅ メッセージ送信成功:", response.data);
// // 	} catch (error) {
// // 		throw new Error("スタッフ登録メッセージの送信に失敗しました");
// // 	}
// // };
