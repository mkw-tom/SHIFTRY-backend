import type { RequestStatus, ShiftStatus } from "@prisma/client";
import apiClient from "../config/axios";
import type { MessageContens } from "../types/message.type";
import {
	sendGroupMessage,
	sendGroupMessageByTrigger,
} from "./common/lineEventMessage";

//// BOTがlineグループ参加時に、lineグループとbot連携画面に誘導通知
export const lineEventMessageFunc = async (
	replyToken: string,
	groupId: string,
	messageContents: MessageContens,
) => {
	try {
		await sendGroupMessageByTrigger(replyToken, messageContents);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

//// シフト提出依頼の通知
export const sendShiftRequestFunc = async (groupId: string) => {
	try {
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
