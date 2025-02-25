import type { Request, Response } from "express";
import {
	createUser,
	editUser,
	fetchUsers,
	removeUser,
} from "../services/userService";
import type { CreateUserInput, UpdateUserInput } from "../types/userTypes";

export const registerUser = async (
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
		res.status(500).json({ error: "Failed to register user" });
	}
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const users = await fetchUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getUsers:", error);
		res.status(500).json({ error: "Failed to get users" });
	}
};

export const updateUser = async (
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

		const updatedUser = await editUser(userId, data);
		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			res.status(400).json({
				error: "User are required",
			});
			return;
		}

		const deleteUser = await removeUser(userId);
		res.status(200).json(deleteUser);
	} catch (error) {
		console.error("Error in deleteUser:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};
