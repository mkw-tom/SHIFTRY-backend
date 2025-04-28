import type { Request, Response } from "express";
import { verifyUserStoreForOwnerAndManager } from "../../common/authorization.service";
import type { ErrorResponse, ValidationErrorResponse } from "../../common/type";
import { changeUserRoleService } from "./service";
import type { ChangeUserRoleResponse } from "./type";
import { changeUserRoleValidate } from "./validation";

const changeUserRoleController = async (
	req: Request,
	res: Response<
		ChangeUserRoleResponse | ValidationErrorResponse | ErrorResponse
	>,
): Promise<void> => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const prased = changeUserRoleValidate.safeParse(req.body);
		if (!prased.success) {
			res.status(400).json({
				ok: false,
				message: "invalid request value",
				errors: prased.error.errors,
			});
			return;
		}
		const { userId: staffId, role } = prased.data;

		const { user, userStore } = await changeUserRoleService(
			staffId,
			storeId,
			role,
		);

		res.json({ ok: true, user, userStore });
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ ok: false, message: "Failed to update user role" });
	}
};

export default changeUserRoleController;
