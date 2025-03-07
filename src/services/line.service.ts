import axios from "axios";
import apiClient from "../config/axios";

//グループ招待時にログイン誘導メッセージを送信
export const groupJoin = async (replyToken: string, message: string) => {
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

// LINEグループメンバー一覧` を取得（userId のみ）
const getGroupMembers = async (groupId: string): Promise<string[]> => {
	try {
		const res = await axios.get(
			`https://api.line.me/v2/bot/group/${groupId}/members/ids`,
			{
				headers: { Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}` },
			},
		);

		return res.data.memberIds; // ["Uxxxxxxxxxx", "Uyyyyyyyyyy", ...]
	} catch (error) {
		console.error("❌ グループメンバー取得エラー:", error);
		return [];
	}
};

// groupIdからグループユーザーの名前と画像を返す
export const getUserProfile = async (
	groupId: string,
	userId: string,
): Promise<{ displayName: string; pictureUrl: string } | null> => {
	try {
		const response = await axios.get(
			`https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
				},
			},
		);

		const data = {
			displayName: response.data.displayName,
			pictureUrl: response.data.pictureUrl,
		};

		return data; // ユーザー名を返す
	} catch (error) {
		console.error("❌ ユーザープロフィール取得エラー");
		console.log(error);
		return null;
	}
};
