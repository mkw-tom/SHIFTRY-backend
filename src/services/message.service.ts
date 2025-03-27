import type { RequestStatus, ShiftStatus } from "@prisma/client";
import apiClient from "../config/axios";
import prisma from "../config/database";

//// BOTがlineグループ参加時に、lineグループとbot連携画面に誘導通知
export const joinFunc = async (replyToken: string, groupId: string) => {
	try {
		const joinMessage =
			"グループに招待ありがとうございます！🎉\n今日からシフト作成をお手伝いします！\n\nオーナー様は以下のリンクからlineグループ連携をお願いします！\n\n🔹 オーナー登録画面\n👉 https://qiita.com";
		await sendGroupMessageByTrigger(replyToken, joinMessage);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

//// シフト提出依頼の通知
export const sendShiftRequestFunc = async (groupId: string) => {
	try {
		const stauts = "HOLD" as RequestStatus;

		const requestMessage =
			"シフト提出をお願いします！\n\n🔹 シフト提出画面\n👉 https://qiita.com";
		await sendGroupMessage(requestMessage, groupId);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

/// シフト確定の通知
export const sendCofirmedShiftFunc = async (groupId: string) => {
	try {
		const confirmedMessage =
			"シフトが出来上がりました！\n\n🔹 シフト確認画面\n👉 https://qiita.com";
		await sendGroupMessage(confirmedMessage, groupId);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

/// ---------------- 個別API ----------------
//☑️ トリガーを受け取ってメッセージ送信する
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

//☑️ グループにメッセージ送信する
export const sendGroupMessage = async (message: string, groupId: string) => {
	try {
		// await sendGroupMessage(groupId, requestMessage);
		await apiClient.post("/v2/bot/message/push", {
			to: groupId, // グループID
			messages: [{ type: "text", text: message }], // 送信メッセージ
		});

		console.log("✅グループに通知が送信できました！");
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};
