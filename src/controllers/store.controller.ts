import type { Request, Response } from "express";
import { updateStoreGroupId } from "../repositories/store.repository";
import { getUserById } from "../repositories/user.repository";
import { getUserStoreByUserId } from "../repositories/userStore.repository";

export const storeConnectLineGroupController = async (
	req: Request,
	res: Response,
) => {
	const userId = req.userId as string;
	const { groupId } = req.body;
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");

	const userStore = await getUserStoreByUserId(userId);
	if (!userStore || userStore.role !== "OWNER") {
		res.status(403).json({ message: "Only owner can update store" });
		return;
	}

	await updateStoreGroupId(userStore.storeId, groupId);
	res.json({ ok: true });
};
