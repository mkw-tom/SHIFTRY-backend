import type { Request, Response } from "express";
import {
	getGroupMemberIds,
	getMembersinfo,
	isUserInGroup,
	registerUsers,
} from "../services/login.service";

export const loginController = async (req: Request, res: Response) => {
	try {
		const { groupId, userId: ownerId } = req.body;
		const isOwner = await isUserInGroup(groupId, ownerId);
		const memberIds = await getGroupMemberIds(groupId);

		if (!isOwner) {
			console.log("オーナーの認証に失敗しました");
			return res.status(400).json({ error: "オーナーの認証に失敗しました" });
		}

		if (!memberIds || memberIds.length === 0) {
			console.log("グループメンバーのID取得に失敗しました😞");
			return res.status(400).json({ error: "faild get members id" });
		}

		const MembersInfo = await getMembersinfo(groupId, memberIds);

		if (!memberIds || memberIds.length === 0) {
			console.log("グループメンバーの情報取得に失敗しました😞");
			return res.status(400).json({ error: "faild get members id" });
		}

		await registerUsers(MembersInfo, ownerId);

		return res.json({
			message: "スタッフ登録完了！",
			memberCount: memberIds.length,
		});
	} catch (error) {
		console.error("❌ スタッフ登録エラー:", error);
		return res.status(500).json({ message: "サーバーエラー" });
	}
};
