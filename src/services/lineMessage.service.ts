import axios from "axios";
import apiClient from "../config/axios";
import prisma from "../config/database";

//✅ グループ招待時にメッセージを送信 （line内で何かのアクショントリガーがあった時）
export const sendGroupMessageByTrigger = async (
	replyToken: string,
	message: string,
) => {
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

//✅ グループ招待時にメッセージを送信
export const sendGroupMessage = async (groupId: string, message: string) => {
	try {
		const response = await apiClient.post("/v2/bot/message/push", {
			to: groupId, // グループID
			messages: [{ type: "text", text: message }], // 送信メッセージ
		});
		console.log("✅ メッセージ送信成功:", response.data);
	} catch (error) {
		console.error("❌ メッセージ送信エラー:", error);
	}
};

export const checkIsOwnerData = async (storeId: string) => {
	return prisma.ownerStore.findFirst({
		where: { storeId: storeId },
	});
	/// データがある場合：{ ownerId: "xxxxxxx", storeId: "yyyyyy" }
	/// データがない場合： null
};
