import type { Request, Response } from "express";
import {
	joinFunc,
	sendCofirmedShiftFunc,
	sendShiftRequestFunc,
} from "../services/message.service";

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
					await joinFunc(event.replyToken, event.source.groupId);
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
		const { groupId, storeId, weekStart } = req.body;
		if (!groupId || !storeId || !weekStart) {
			res.status(400).json({ error: "Missing require field" });
			return;
		}
		await sendShiftRequestFunc(groupId, storeId, weekStart);

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
		const { groupId, storeId, weekStart } = req.body;
		if (!groupId || !storeId || !weekStart) {
			res.status(400).json({ error: "Missing require field" });
			return;
		}
		await sendCofirmedShiftFunc(groupId, storeId, weekStart);

		res.status(200).json({ message: "sucess send a shift confirmed message" });
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
		res.status(500).json({ error: "Failed to send message " });
	}
};
