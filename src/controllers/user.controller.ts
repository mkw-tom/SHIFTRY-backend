import type { Request, Response } from "express";
import {
	deleteUser,
	getStoreUser,
	getUserById,
	getUsers,
	updateUser,
	upsertUser,
} from "../repositories/user.repository";
import {
	getUserFromStore,
	getUserStoreByUserIdAndStoreId,
} from "../repositories/userStore.repository";
import {
	verifyUser,
	verifyUserStore,
	verifyUserStoreForOwnerAndManager,
} from "../services/common/authorization.service";
import { changeUserRoleService } from "../services/user.service";
import type {
	UpdateUserInput,
	UpsertUserInput,
	UserRole,
} from "../types/user.types";
import {
	changeUserRoleValidate,
	updateUserProlfileValidate,
} from "../validations/user.validation";

export const getAlluserController = async (req: Request, res: Response) => {
	try {
		const users = await getUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getAlluserController:", error);
		res.status(500).json({ error: "Failed to get users" });
	}
};

/// 店舗ユーザーを取得
export const getUserFromStoreController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStore(userId, storeId);

		const storeUsers = await getUserFromStore(storeId);
		res.status(200).json(storeUsers);
	} catch (error) {
		console.error("Error in getStoreUsersController:", error);
		res.status(500).json({ error: "Failed to get store users" });
	}
};

/// ユーザーのプロフィール編集
export const updateUserProfileController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const bodyParesed = updateUserProlfileValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				message: "Invalid request",
				errors: {
					user: bodyParesed.error?.errors,
				},
			});
			return;
		}
		const updateData = bodyParesed.data;

		await updateUser(userId, updateData);
		res.status(200).json({ ok: true });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};

export const deleteUserController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const deleted = await deleteUser(userId);
		res.status(200).json(deleted);
	} catch (error) {
		console.error("Error in deleteUser:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};

///　スタッフ権限の変更
export const changeUserRoleController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = changeUserRoleValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				message: "invalid request value",
				errors: bodyParesed.error.errors,
			});
			return;
		}
		const { userId: staffId, role } = bodyParesed.data;

		await changeUserRoleService(staffId, storeId, role);
		res.json({ ok: true });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ error: "Failed to update user role" });
	}
};
