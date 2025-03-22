import type { Request, Response } from "express";
import {
	deleteUser,
	getStoreUser,
	getUserAndStore,
	getUsers,
	updateUser,
	upsertUser,
} from "../repositories/user.repository";
import type {
	UpdateUserInput,
	UpsertUserInput,
	UserRole,
} from "../types/user.types";

export const getAlluserController = async (req: Request, res: Response) => {
	try {
		const users = await getUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getAlluserController:", error);
		res.status(500).json({ error: "Failed to get users" });
	}
};

/// ✅ 店舗ユーザーを取得
export const getUserAndStoreController = async (
	req: Request,
	res: Response,
) => {
	try {
		const { storeId, userId } = req.params;
		if (!storeId || !userId) {
			res.status(400).json({ error: "Missing required fields" });
			return;
		}

		const storeUsers = await getUserAndStore(storeId, userId);
		if (!storeUsers) {
			res.status(400).json({ error: "store users are not found" });
			return;
		}
		res.status(200).json(storeUsers);
	} catch (error) {
		console.error("Error in getStoreUsersController:", error);
		res.status(500).json({ error: "Failed to get store users" });
	}
};

/// ✅ 店舗の全てのユーザーを取得
export const getStoreController = async (req: Request, res: Response) => {
	try {
		const { storeId } = req.params;
		if (!storeId) {
			return res.status(400).json({ error: "storeId が必要です" });
		}

		const users = await getStoreUser(storeId);
		return res.json(users);
	} catch (error) {
		console.error("❌ スタッフ取得エラー:", error);
		return res.status(500).json({ error: "faild get staffs" });
	}
};

///　✅　ユーザーを作成
export const upsertUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { lineId, name, pictureUrl, role } = req.body;

		if (!lineId || !name || !role) {
			res.status(400).json({ error: "Missing required fields" });
			return;
		}

		const data: UpsertUserInput = {
			lineId,
			name,
			pictureUrl,
			role: role as UserRole,
		};

		const user = await upsertUser(data);
		res.status(201).json(user);
	} catch (error) {
		console.error("Error in registerUser:", error);
		res.status(500).json({ error: "Failed to create user" });
	}
};

/// ✅　ユーザーのプロフィール編集　・　権限の変更や
export const deleteUserController = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			res.status(400).json({
				error: "userId are required",
			});
			return;
		}

		const deleted = await deleteUser(userId);
		res.status(200).json(deleted);
	} catch (error) {
		console.error("Error in deleteUser:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};

/// ✅ ユーザーのプロフィール編集
export const updateUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { userId } = req.params;
		const { name, pictureUrl, role } = req.body;

		if (!userId || (!name && !role)) {
			res.status(400).json({
				error: "User ID and at least one field (name or role) are required",
			});
			return;
		}

		const data: UpdateUserInput = {};
		if (name) data.name = name;
		if (role) data.role = role;
		if (pictureUrl) data.pictureUrl = pictureUrl;

		const updatedUser = await updateUser(userId, data);
		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};

///　❌　多分使わない
// export const getUsersController = async (
// 	req: Request,
// 	res: Response,
// ): Promise<void> => {
// 	try {
// 		const users = await fetchUsers();
// 		res.status(200).json(users);
// 	} catch (error) {
// 		console.error("Error in getUsers:", error);
// 		res.status(500).json({ error: "Failed to get users" });
// 	}
// };
