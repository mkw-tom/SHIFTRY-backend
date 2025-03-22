import { type RequestStatus, type ShiftStatus, UserRole } from "@prisma/client";
import apiClient from "../config/axios";
import prisma from "../config/database";

//// ✅✅　botがlineグループに参加した時にstoreデータが自動作成
export const joinFunc = async (replyToken: string, groupId: string) => {
	try {
		const joinMessage =
			"グループに招待ありがとうございます！🎉\n今日からシフト作成をお手伝いします！\n\n以下のリンクからオーナー様のみ登録をお願いします！\n\n🔹 オーナー登録画面\n👉 https://qiita.com";
		await sendGroupMessageByTrigger(replyToken, joinMessage);

		// await upsertStore(groupId, "unknown")

		await prisma.store.upsert({
			where: { groupId },
			update: { groupId: groupId },
			create: { groupId: groupId, name: "unknown" },
		});

		console.log(
			"✅ 店舗データ作成済み✨ オーナー登録のメッセージを送信しました",
		);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

//// ✅✅ シフトリクエストのステータス更新　& シフト提出通知の送信
export const sendShiftRequestFunc = async (
	groupId: string,
	storeId: string,
	weekStart: string,
) => {
	try {
		const stauts = "HOLD" as RequestStatus;

		await prisma.shiftRequest.update({
			where: {
				storeId_weekStart: {
					storeId: storeId,
					weekStart: new Date(weekStart),
				},
			},
			data: {
				status: stauts,
			},
		});

		const requestMessage =
			"シフト提出をお願いします！\n\n🔹 シフト提出画面\n👉 https://qiita.com";
		await sendGroupMessage(requestMessage, groupId);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

export const sendCofirmedShiftFunc = async (
	groupId: string,
	storeId: string,
	weekStart: string,
) => {
	try {
		const status = "CONFIRMED" as ShiftStatus;
		// await updateAssignShiftStatus(storeId, weekStart, status)
		await prisma.shiftRequest.update({
			where: {
				storeId_weekStart: {
					storeId: storeId,
					weekStart: new Date(weekStart),
				},
			},
			data: {
				status: status,
			},
		});

		const confirmedMessage =
			"シフトが出来上がりました！\n\n🔹 シフト確認画面\n👉 https://qiita.com";
		await sendGroupMessage(confirmedMessage, groupId);
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

/// ---------------- 個別API ----------------
//☑️ トリガーを受け取ってメッセージ送信する
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

//☑️ グループにメッセージ送信する
export const sendGroupMessage = async (message: string, groupId: string) => {
	try {
		// await sendGroupMessage(groupId, requestMessage);
		await apiClient.post("/v2/bot/message/push", {
			to: groupId, // グループID
			messages: [{ type: "text", text: message }], // 送信メッセージ
		});

		console.log("✅グループに通知が送信できました！");
	} catch (error) {
		throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
	}
};

//☑️ APIを叩いてメッセージ送信する
// export const sendShiftRequest = async (groupId: string) => {
//   try {
//     const requestMessage =
//       "シフト提出をお願いします！\n\n🔹 シフト提出画面\n👉 https://qiita.com";
//     // await sendGroupMessage(groupId, requestMessage);
//     await apiClient.post("/v2/bot/message/push", {
// 			to: groupId, // グループID
// 			messages: [{ type: "text", text: requestMessage }], // 送信メッセージ
// 		});

//     console.log(
//      "シフト提出通知が完了しました！"
//     );
//   } catch (error) {
//     throw new Error("メッセージ送信もしくはデータ作成に失敗しました");
//   }
// };

// export const upsertStore = async (groupId: string, name: string) => {
// 	return prisma.store.upsert({
// 		where: { groupId},
// 		update: { name: name },
// 		create:  { groupId: groupId, name: name },
// 	})
// }
