import type { Request, Response } from "express";
import { getUserFromStore } from "../../../../repositories/userStore.repository";
import { verifyUserStore } from "../../../common/authorization.service";
import type { ErrorResponse } from "../../../common/type";
import type { GetUserFromStoreResponse } from "./type";

const getUserFromStoreController = async (
	req: Request,
	res: Response<GetUserFromStoreResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const userStoreWithUsers = await getUserFromStore(storeId);
		const storeUsers = userStoreWithUsers.map((userStore) => userStore.user);
		if (storeUsers.length === 0) {
			res.status(404).json({ ok: false, message: "users are not found" });
			return;
		}
		res.status(200).json({ ok: true, storeUsers });
	} catch (error) {
		console.error("Error in getStoreUsersController:", error);
		res.status(500).json({ ok: false, message: "Failed to get store users" });
	}
};

export default getUserFromStoreController;
