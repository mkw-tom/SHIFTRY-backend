import type { Request, Response } from "express";
import { updateUser } from "../../../repositories/user.repository";
import { verifyUser } from "../../common/authorization.service";
import type {
	ErrorResponse,
	ValidationErrorResponse,
} from "../../common/types/errors";
import type { UpdateUserProfileResponse } from "./type";
import { updateUserProlfileValidate } from "./validation";

const updateUserProfileController = async (
	req: Request,
	res: Response<
		UpdateUserProfileResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const parsed = updateUserProlfileValidate.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: parsed.error.errors,
			});
			return;
		}
		const updatedData = parsed.data;
		const updatedUser = await updateUser(userId, updatedData);

		res.status(200).json({ ok: true, updatedUser });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ ok: false, message: "Failed to update user" });
	}
};

export default updateUserProfileController;
