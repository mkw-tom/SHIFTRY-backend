import type { Request, Response } from "express";
import { deleteUser } from "../../../repositories/user.repository";
import { verifyUser } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/type";
import type { DeleteUserResponse } from "./type";

const deleteUserController = async (
	req: Request,
	res: Response<DeleteUserResponse | ErrorResponse>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const deletedUser = await deleteUser(userId);

		res.status(200).json({ ok: true, deletedUser });
	} catch (error) {
		console.error("Error in deleteUser:", error);
		res.status(500).json({ ok: false, message: "Failed to delete user" });
	}
};

export default deleteUserController;
