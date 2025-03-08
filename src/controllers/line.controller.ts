import type { Request, Response } from "express";
import { getUserProfile, groupJoin } from "../services/line.service";
import { createStore } from "../services/store.service";

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
					const joinMessage =
						"グループに招待ありがとうございます！🎉\n今日からシフト作成をお手伝いします！\n\n以下のリンクからオーナー様のみ登録をお願いします！\n\n🔹 オーナー登録画面\n👉 https://qiita.com";

					await groupJoin(event.replyToken, joinMessage);
					await createStore({
						name: "",
						groupId: event.source.groupId,
					});
					console.log(`✅ グループ ${event.source.groupId} にメッセージ送信`);
				} catch (error) {
					console.error("❌ Webhook処理エラー:", error);
				}
			}
		}
	} catch (error) {
		console.error("❌ Webhook処理エラー:", error);
	}

	res.status(201).json({ message: "OK" });
};

// /// 🔹 グループに新たなメンバーが追加された時の自動メッセージ
// if (event.type === "memberJoined" && event.source.groupId) {
//   const members = event.joined.members;
//   const groupId = event.source.groupId;

//   for (const member of members) {
//     if (member.type === "user" && member.userId) {
//       const storeCode = event.source.groupId.slice(-6); // グループIDの末尾6桁を店舗コードとして取得
//       const displayName = await getUserProfile(groupId, member.userId); // 🔹 `user.service.ts` から `displayName` を取得
//       const memberName = displayName
//         ? `@${displayName}`
//         : "新しいメンバー";

//       const menberJoinedMessage = `${memberName} さんがグループに参加しました！🎉\nシフト管理を始めるには、以下のリンクからログインしてください。\n\n🔑店舗コード：${storeCode}\n\n🔹 オーナーの方はこちら\n👉 https://qiita.com\n\n🔹 スタッフの方はこちら\n👉 https://zenn.dev/`;

//       await groupJoin(event.replyToken, menberJoinedMessage);
//       console.log(
//         `✅ ${memberName} がグループ ${event.source.groupId} に追加されました`
//       );
//     }
//   }
// }
