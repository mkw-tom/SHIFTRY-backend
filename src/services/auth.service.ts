import axios from "axios";
import apiClient from "../config/axios";
import prisma from "../config/database";
import { CreateUserInput, LineUser, UserRole } from "../types/authType";



//　--------------- ✅ グループにメンバーが存在するか && おーなのプロフィールが取得できる 　------------
export const isUserAndGetProfile = async (
  groupId: string,
  userId: string
): Promise<LineUser> => {
  const isUser = await isUserInGroup(groupId, userId);
  if (!isUser) {
    throw new Error("オーナーの認証に失敗しました");
  }

  //オーナーのプロフィールを取得
  const userProfile = await getUserProfile(groupId, userId);
  if (!userProfile) {
    throw new Error("オーナープロファイルの取得に失敗しました");
  }

  return userProfile;
};

// ✔︎ グループ内のメンバーかどうかを確認
export const isUserInGroup = async (
  groupId: string,
  userId: string
): Promise<boolean> => {
	// グループメンバーのuserId一覧を取得
  const res = await axios.get(
    `https://api.line.me/v2/bot/group/${groupId}/members/ids`,
    {
      headers: { Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}` },
    }
  );
  const groupMembers = res.data.memberIds;

  return groupMembers.includes(userId);
};

//　✔︎　ユーザーのプロフィールを返す
export const getUserProfile = async (
  groupId: string,
  userId: string
): Promise<LineUser | null> => {
  try {
    const response = await axios.get(
      `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
        },
      }
    );

    return response.data; // ユーザー名を返す
  } catch (error) {
    console.error("❌ ユーザープロフィール取得エラー");
    console.log(error);
    return null;
  }
};






// ------------------- ✅ ログインユーザーのデータ作成 ------------------------
export const createLoginUserData = async (
  userProfile: LineUser,
  storeId: string,
  role: UserRole
) => {
	const data: CreateUserInput = {
		lineId: userProfile.userId,
		name: userProfile.displayName,
		pictureUrl: userProfile.pictureUrl,
		role: role
	}

	const user  = await prisma.user.upsert({
		where: { lineId: data.lineId },
		create: data,
		update: data,
	});

  if (!user) {
    throw new Error("ユーザー登録に失敗しました");
  }
  // オーナーまたはスタッフとして店舗に紐付ける
  const storeAssociation =
    role === "OWNER"
      ? await createDataOwnerToStore(userProfile.userId, storeId)
      : await createDataStaffToStore(userProfile.userId, storeId);
  if (!storeAssociation) {
    throw new Error(`${role} の店舗登録に失敗しました`);
  }
  return user;
};

// ✔︎ オーナーの中間データを作成
export const createDataOwnerToStore = async (
  ownerId: string,
  storeId: string
) => {
  return prisma.ownerStore.create({
    data: {
      ownerId: ownerId,
      storeId: storeId,
    },
  });
};

// ✔︎　オーナーの中間データを作成
export const createDataStaffToStore = async (
  userId: string,
  storeId: string
) => {
  return prisma.userStore.create({
    data: {
      userId: userId,
      storeId: storeId,
    },
  });
};





// ------------------- ✅ lineグループのスタッフにログインURLを通知 ------------------------
export const sendStaffLoginMessage = async (groupId: string): Promise<void> => {
  try {
    const staffLoginMessage =
      "スタッフの皆さんにお願いです📢\n\n以下のリンクからスタッフ登録をお願いします！\n\n🔹 スタッフ登録画面\n👉 https://qiita.com";

    const response = await apiClient.post("/v2/bot/message/push", {
      to: groupId, // グループID
      messages: [{ type: "text", text: staffLoginMessage }], // 送信メッセージ
    });
    console.log("✅ メッセージ送信成功:", response.data);
  } catch (error) {
    throw new Error("スタッフ登録メッセージの送信に失敗しました");
  }
};
