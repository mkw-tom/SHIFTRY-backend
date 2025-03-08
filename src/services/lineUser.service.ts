import axios from "axios";
import type { LineUser } from "../types/lineType";

// groupIdからグループユーザーの名前と画像を返す
export const getUserProfile = async (
	groupId: string,
	userId: string,
): Promise<LineUser | null> => {
	try {
		const response = await axios.get(
			`https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
				},
			},
		);

		return response.data; // ユーザー名を返す
	} catch (error) {
		console.error("❌ ユーザープロフィール取得エラー");
		console.log(error);
		return null;
	}
};

// ✅ LINEグループメンバーの userId 一覧を取得
export const getGroupMemberIds = async (groupId: string) => {
	const res = await axios.get(
		`https://api.line.me/v2/bot/group/${groupId}/members/ids`,
		{
			headers: { Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}` },
		},
	);

	return res.data.memberIds; // string[]
};

// ✅ グループ内のメンバーかどうかを確認
export const isUserInGroup = async (
	groupId: string,
	userId: string,
): Promise<boolean> => {
	const groupMembers = await getGroupMemberIds(groupId);
	return groupMembers.includes(userId);
};
