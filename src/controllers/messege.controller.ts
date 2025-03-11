import type { Request, Response } from "express";
import { checkIsOwnerData } from "../repositories/message.repository";
import { joinFunc, memberJoinedFunc } from "../services/message.service";

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
						const userId = member.userId; /// 参加したメンバーのuserId
						await memberJoinedFunc(event.replyToken, groupId, userId);
					}
				}
			}
		}
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
	}

	res.status(201).json({ message: "OK" });
};
