import axios from "axios";
import apiClient from "../config/axios";
import prisma from "../config/database";
import { createStoreAfterLogin } from "../repositories/message.repository";

//✅　------- しふともがグループ参加直後にメッセージの送信 ＆ 店舗データ作成 ------
export const joinFunc = async (replyToken: string, groupId: string) => {
	try {
		const joinMessage =
			"グループに招待ありがとうございます！🎉\n今日からシフト作成をお手伝いします！\n\n以下のリンクからオーナー様のみ登録をお願いします！\n\n🔹 オーナー登録画面\n👉 https://qiita.com";
		await sendGroupMessageByTrigger(replyToken, joinMessage);
		await createStoreAfterLogin({
			groupId: groupId,
			name: "",
		});

		console.log(
			"✅ 店舗データ作成済み✨ オーナー登録のメッセージを送信しました",
		);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

//✅ ---------------　新メンバーがグループ参加直後にメッセージの送信--------------
export const memberJoinedFunc = async (
	replyToken: string,
	groupId: string,
	userId: string,
) => {
	try {
		const memberName = await getDisplayName(groupId, userId);
		const menberJoinedMessage = `${memberName} さん！はじめまして！🎉\n以下のリンクからスタッフ登録お願いします！\n🔹 スタッフ登録画面\n👉 https://qiita.com\n`;

		await sendGroupMessageByTrigger(replyToken, menberJoinedMessage);
		console.log(`✅ ${memberName} がグループ ${groupId} に追加されました`);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

//✅ -------- グループ招待時にメッセージを送信 （line内で何かのアクショントリガーがあった時） ---------
export const sendGroupMessageByTrigger = async (
	replyToken: string,
	message: string,
) => {
	try {
		await apiClient.post("/", {
			replyToken: replyToken,
			messages: [{ type: "text", text: message }],
		});

		console.log("✅ LINEメッセージ送信成功！");
	} catch (error) {
		console.error("❌ LINEメッセージ送信エラー:", error);
	}
};

//✅ グループ招待時にメッセージを送信
export const sendGroupMessage = async (groupId: string, message: string) => {
	try {
		const response = await apiClient.post("/v2/bot/message/push", {
			to: groupId, // グループID
			messages: [{ type: "text", text: message }], // 送信メッセージ
		});
		console.log("✅ メッセージ送信成功:", response.data);
	} catch (error) {
		console.error("❌ メッセージ送信エラー:", error);
	}
};

// -------------------------------------　使い回しAPI　-------------------------------------------

// ☑️　ユーザーの名前を返す （名無しの場合は "新しいユーザー"　表示）
export const getDisplayName = async (groupId: string, userId: string) => {
	try {
		const response = await axios.get(
			`https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
				},
			},
		);

		const displayName = response.data.displayName; // ユーザー名を返す
		const memberName = displayName ? `@${displayName}` : "新しいメンバー";

		return memberName;
	} catch (error) {
		console.error("❌ ユーザープロフィール取得エラー");
		console.log(error);
		return null;
	}
};
