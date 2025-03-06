import type { Request, Response } from "express";
import {
	createUser,
	deleteUser,
	fetchUsers,
	updateUser,
} from "../services/user.service";
import type { CreateUserInput, UpdateUserInput } from "../types/userTypes";

export const createUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { lineId, name, role } = req.body;

		if (!lineId || !name || !role) {
			res.status(400).json({ error: "Missing required fields" });
			return;
		}

		const data: CreateUserInput = {
			lineId,
			name,
			role: role as CreateUserInput["role"],
		};

		const user = await createUser(data);
		res.status(201).json(user);
	} catch (error) {
		console.error("Error in registerUser:", error);
		res.status(500).json({ error: "Failed to create user" });
	}
};

export const getUsersController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const users = await fetchUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getUsers:", error);
		res.status(500).json({ error: "Failed to get users" });
	}
};

export const updateUserController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { userId } = req.params;
		const { name, role } = req.body;

		if (!userId || (!name && !role)) {
			res.status(400).json({
				error: "User ID and at least one field (name or role) are required",
			});
			return;
		}

		const data: UpdateUserInput = {};
		if (name) data.name = name;
		if (role) data.role = role;

		const updatedUser = await updateUser(userId, data);
		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};

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
