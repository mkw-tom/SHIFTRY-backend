import type { Request, Response } from "express";
import { updateUser } from "../../../../repositories/user.repository";
import { verifyUser } from "../../../common/authorization.service";
import type { ErrorResponse } from "../../../common/type";
import type {
	UpdateUserProfileResponse,
	UpdateUserProfileValidationErrorResponse,
} from "./type";
import { updateUserProlfileValidate } from "./validation";

export const updateUserProfileController = async (
	req: Request,
	res: Response<
		| UpdateUserProfileResponse
		| UpdateUserProfileValidationErrorResponse
		| ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const bodyParesed = updateUserProlfileValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				ok: false,
				message: "Invalid request",
				errors: {
					user: bodyParesed.error?.errors,
				},
			});
			return;
		}
		const updatedData = bodyParesed.data;

		const updatedUser = await updateUser(userId, updatedData);
		if (!updatedUser) {
			res.status(404).json({ ok: false, message: "failed updated user" });
			return;
		}

		res.status(200).json({ ok: true, updatedUser });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ ok: false, message: "Failed to update user" });
	}
};
