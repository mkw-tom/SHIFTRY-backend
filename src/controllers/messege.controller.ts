import type { Request, Response } from "express";
import {
	URI_CONNECT_LINE_GROUP,
	URI_REGISTER_OWNER,
	URI_REGISTER_STAFF,
	URI_SHIFT_SUBMITTED,
} from "../lib/env";
import { verifyUserStoreForOwnerAndManager } from "../services/common/authorization.service";
import {
	sendGroupFlexMessage,
	sendGroupMessageByTrigger,
} from "../services/message.service";
import { generateJWT } from "../utils/JWT/jwt";

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
					const group_token = generateJWT({ groupId: event.source.groupId });
					const signedUrl = `${URI_CONNECT_LINE_GROUP}?group_token=${group_token}`;

					const joinMessage = {
						text1: "グループに招待ありがとうございます！🎉",
						text2: "今日からシフト作成をお手伝いします！",
						text3: "オーナー様のみ連携お願いします！",
						label: "LINEグループ連携",
						uri: signedUrl,
					};

					await sendGroupMessageByTrigger(event.replyToken, joinMessage);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}

			if (event.type === "follow" && event.source.userId) {
				try {
					const followMessage = {
						text1: "オーナー様は、以下の手順で登録✨",
						text2: "1. オーナー＆店舗登録",
						text3: "2. 「SHIFTRY」をlineグループに招待",
						label: "登録へ進む",
						uri: URI_REGISTER_OWNER,
					};

					await sendGroupMessageByTrigger(event.replyToken, followMessage);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}
		}
		res.status(201).json({ message: "OK" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
	}
};

/// ✅ シフト提出通知をグループに送信
export const sendShiftRequestFuncController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		await sendGroupFlexMessage(groupId, {
			text1: "スタッフの皆さんへ🎉",
			text2: "以下のボタンから希望提出を必ずお願いします！",
			text3: "提出期限：",
			label: "シフト希望提出",
			uri: URI_SHIFT_SUBMITTED,
		});

		res.status(200).json({ message: "sucess send a shift request" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ error: "Failed to send message " });
	}
};

///✅ シフト確定通知をグループに送信
export const sendConfirmShiftFuncController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		await sendGroupFlexMessage(groupId, {
			text1: "シフトが出来上がりました！",
			text2: "以下のボタンからシフト確認をお願いします！",
			text3: "期間：",
			label: "シフト確認",
			uri: URI_SHIFT_SUBMITTED,
		});

		res.status(200).json({ message: "sucess send a shift confirmed message" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ error: "Failed to send message " });
	}
};
