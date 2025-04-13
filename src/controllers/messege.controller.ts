import type { Request, Response } from "express";
import { URI_CONNECT_LINE_GROUP, URI_REGISTER_OWNER } from "../lib/env";
import { verifyUserStoreForOwnerAndManager } from "../services/common/authorization.service";
import {
	lineEventMessageFunc,
	sendCofirmedShiftFunc,
	sendShiftRequestFunc,
} from "../services/message.service";
import { pushMessageValidate } from "../validations/message.validation";

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
					const joinMessage = {
						text1: "グループに招待ありがとうございます！🎉",
						text2: "今日からシフト作成をお手伝いします！",
						text3: "オーナー様のみ連携お願いします！",
						label: "LINEグループ連携",
						uri: URI_CONNECT_LINE_GROUP,
					};

					await lineEventMessageFunc(
						event.replyToken,
						event.source.groupId,
						joinMessage,
					);
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

					await lineEventMessageFunc(
						event.replyToken,
						event.source.groupId,
						followMessage,
					);
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
		await verifyUserStoreForOwnerAndManager(userId, storeId);
		const bodyParesed = pushMessageValidate.parse(req.body);
		if (!bodyParesed.groupId) {
			res.status(400).json({ error: "Missing require field" });
			return;
		}
		const groupId = bodyParesed.groupId;

		await sendShiftRequestFunc(groupId);

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
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = pushMessageValidate.parse(req.body);
		if (!bodyParesed.groupId) {
			res.status(400).json({ error: "Missing require field" });
			return;
		}
		const groupId = bodyParesed.groupId;

		await sendCofirmedShiftFunc(groupId);

		res.status(200).json({ message: "sucess send a shift confirmed message" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ error: "Failed to send message " });
	}
};
