import type { Request, Response } from "express";
import { isUserAndGetProfile } from "../services/auth.service";
import type { LineUser } from "../types/auth.type";

// ---------- ユーザー認証 ----------
export const authController = async (req: Request, res: Response) => {
	try {
		const { groupId, userId, storeId, role } = req.body;
		if (!groupId || !userId || !storeId) {
			console.log("リクエストエラー");
			res.status(400).json({ error: "リクエストエラー" });
			return;
		}

		//オーナーがライングループに所属しているか確認
		const userProfile: LineUser | undefined = await isUserAndGetProfile(
			groupId,
			userId,
		);
		if (!userProfile) {
			res.status(401).json({
				error: `${role === "OWNER" ? "オーナー" : "スタッフ"}の認証に失敗しました`,
			});
			return;
		}

		res.json({
			message: `${role === "OWNER" ? "オーナー" : "スタッフ"}認証完了！`,
		});
	} catch (error) {
		console.error("❌ 登録エラー:", error);
		res.status(500).json({ message: "サーバーエラー" });
	}
};
