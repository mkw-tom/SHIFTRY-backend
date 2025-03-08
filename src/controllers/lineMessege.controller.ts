import type { Request, Response } from "express";
import {
	checkIsOwnerData,
	sendGroupMessageByTrigger,
} from "../services/lineMessage.service";
import { getUserProfile } from "../services/lineUser.service";
import { createStore } from "../services/store.service";

export const groupJoinController = async (req: Request, res: Response) => {
	const events = req.body.events;

	if (!events) {
		res.status(400).json({ error: "Missing required fields" });
		return;
	}

	try {
		for (const event of events) {
			/// 🔹 グループに招待された時の自動メッセージ
			if (event.type === "join" && event.source.groupId) {
				try {
					const joinMessage =
						"グループに招待ありがとうございます！🎉\n今日からシフト作成をお手伝いします！\n\n以下のリンクからオーナー様のみ登録をお願いします！\n\n🔹 オーナー登録画面\n👉 https://qiita.com";

					await sendGroupMessageByTrigger(event.replyToken, joinMessage);
					await createStore({
						name: "",
						groupId: event.source.groupId,
					});
					console.log(
						`✅ グループ ${event.source.groupId} にオーナー登録のメッセージ送信`,
					);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}

			if (event.type === "memberJoined" && event.source.groupId) {
				const members = event.joined.members;
				const groupId = event.source.groupId;

				const isOwnerData = await checkIsOwnerData(groupId);
				if (!isOwnerData) {
					console.error("❌ オーナーが登録されていません");
					return;
				}

				for (const member of members) {
					if (member.type === "user" && member.userId) {
						const displayName = await getUserProfile(groupId, member.userId); // 🔹 `user.service.ts` から `displayName` を取得
						const memberName = displayName
							? `@${displayName.displayName}`
							: "新しいメンバー";

						const menberJoinedMessage = `${memberName} さん！はじめまして！🎉\n以下のリンクからスタッフ登録お願いします！\n🔹 スタッフ登録画面\n👉 https://qiita.com\n`;

						await sendGroupMessageByTrigger(
							event.replyToken,
							menberJoinedMessage,
						);
						console.log(
							`✅ ${memberName} がグループ ${event.source.groupId} に追加されました`,
						);
					}
				}
			}
		}
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
	}

	res.status(201).json({ message: "OK" });
};
