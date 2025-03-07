import axios from "axios";
import prisma from "../config/database";
import type { MemberInfo } from "../types/loginType";
import { getUserProfile } from "./line.service";

// ✅ LINEグループメンバーの userId 一覧を取得
export const getGroupMemberIds = async (groupId: string) => {
	const res = await axios.get(
		`https://api.line.me/v2/bot/group/${groupId}/members/ids`,
		{
			headers: { Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}` },
		},
	);

	return res.data.memberIds; // ["Uxxxxxxxxxx", "Uyyyyyyyyyy", ...]
};

// ✅ グループ内のメンバーかどうかを確認
export const isUserInGroup = async (
	groupId: string,
	userId: string,
): Promise<boolean> => {
	const groupMembers = await getGroupMemberIds(groupId);
	return groupMembers.includes(userId);
};

// ✅ ユーザー(スタッフ・オーナー)情報の配列を返す
export const getMembersinfo = async (
	groupId: string,
	memberIds: string[],
): Promise<MemberInfo[]> => {
	const membersInfo = [];
	for (const userId of memberIds) {
		const profile = await getUserProfile(groupId, userId);
		if (!profile) {
			console.error("❌ ユーザープロフィール取得エラー");
			continue;
		}

		const { displayName, pictureUrl } = profile;
		membersInfo.push({ lineId: userId, name: displayName, pictureUrl });
		console.log("✅ ユーザー名:", displayName);
		console.log("✅ 画像URL:", pictureUrl);
	}

	return membersInfo;
};

// ✅ ユーザー(スタッフ・オーナー)を登録
export const registerUsers = async (
	membersInfo: MemberInfo[],
	ownerLineId: string,
) => {
	if (!membersInfo || membersInfo.length === 0) {
		console.log("⚠️ ユーザー情報が空または無効のため、登録をスキップします。");
		return;
	}

	return await prisma.user.createMany({
		data: membersInfo.map((member) => ({
			lineId: member.lineId,
			name: member.name,
			pictureUrl: member.pictureUrl,
			role: member.lineId === ownerLineId ? "OWNER" : "STAFF",
		})),
		skipDuplicates: true,
	});
};
