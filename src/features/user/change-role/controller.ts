import type { Request, Response } from "express";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";
import type { ErrorResponse } from "../../common/type";
import { changeUserRoleService } from "./service";
import type {
	ChangeUserRoleResponse,
	ChangeUserRoleValidationErrorResponse,
} from "./type";
import { changeUserRoleValidate } from "./validation";

const changeUserRoleController = async (
	req: Request,
	res: Response<
		| ChangeUserRoleResponse
		| ChangeUserRoleValidationErrorResponse
		| ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = changeUserRoleValidate.safeParse(req.body);
		if (!bodyParesed.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: bodyParesed.error.errors,
			});
			return;
		}
		const { userId: staffId, role } = bodyParesed.data;

		const { user, userStore } = await changeUserRoleService(
			staffId,
			storeId,
			role,
		);
		if (!user) {
			res
				.status(404)
				.json({ ok: false, message: "changed role user is not found" });
			return;
		}
		if (!userStore) {
			res
				.status(404)
				.json({ ok: false, message: "changed role userStore is not found" });
			return;
		}

		res.json({ ok: true, user, userStore });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ ok: false, message: "Failed to update user role" });
	}
};

export default changeUserRoleController;
