import type { Request, Response } from "express";
import {
	createLoginUserData,
	isUserAndGetProfile,
	sendStaffLoginMessage,
} from "../services/auth.service";
import { sendGroupMessage } from "../services/lineMessage.service";
import { getUserProfile, isUserInGroup } from "../services/lineUser.service";
import { createUser } from "../services/user.service";
import type { LineUser } from "../types/lineType";

// ---------- ユーザー認証 ----------
export const authController = async (req: Request, res: Response) => {
	try {
		const { groupId, userId, storeId, role } = req.body;
		if (!groupId || !userId || !storeId) {
			console.log("リクエストエラー");
			return res.status(400).json({ error: "リクエストエラー" });
		}

		//オーナーがライングループに所属しているか確認
		const userProfile: LineUser | undefined = await isUserAndGetProfile(
			groupId,
			userId,
		);
		if (!userProfile) {
			return res.status(401).json({
				error: `${role === "OWNER" ? "オーナー" : "スタッフ"}の認証に失敗しました`,
			});
		}

		//オーナーの情報をデータベースに登録
		const userData = await createLoginUserData(userProfile, storeId, role);
		if (!userData) {
			return res.status(500).json({ error: "ユーザー登録に失敗しました" });
		}

		//オーナー登録後にスタッフにログインメッセージをを送信
		if (role === "OWNER") {
			await sendStaffLoginMessage(groupId);
		}

		return res.json({
			message: `${role === "OWNER" ? "オーナー" : "スタッフ"}登録完了！`,
		});
	} catch (error) {
		console.error("❌ 登録エラー:", error);
		return res.status(500).json({ message: "サーバーエラー" });
	}
};
