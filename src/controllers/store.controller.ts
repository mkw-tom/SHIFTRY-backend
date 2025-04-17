import { Store } from "@prisma/client";
import type { Request, Response } from "express";
import {
	createStore,
	getStoreByGroupId,
	updateStoreGroupId,
	updateStoreName,
} from "../repositories/store.repository";
import { getUserById } from "../repositories/user.repository";
import {
	createUserStore,
	getStoreFromUser,
} from "../repositories/userStore.repository";
import {
	verifyUser,
	verifyUserForOwner,
	verifyUserStoreForOwner,
	verifyUserStoreForOwnerAndManager,
} from "../services/common/authorization.service";
import { generateJWT } from "../utils/JWT/jwt";
import {
	connectGoupIdValidate,
	storeInputValidate,
	updateStoreNameValidate,
} from "../validations/store.validation";

export const storeConnectLineGroupController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		const groupId = req.groupId as string;
		await verifyUserStoreForOwner(userId, storeId);
		console.log(storeId, userId);

		// const bodyParesed = connectGoupIdValidate.parse(req.body);
		// const groupId = bodyParesed.groupId;
		const user = await getUserById(userId);
		if (!user) throw new Error("User not found");

		const response = await updateStoreGroupId(storeId, groupId);
		const group_token = generateJWT({ groupId: groupId });
		console.log(response);
		res.json({ ok: true, group_token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/// ユーザーが所属するすべての店舗を取得
export const getStoreFromUserController = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.userId as string;
		await verifyUser(userId);

		const stores = await getStoreFromUser(userId);
		res.json({ stores });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const addManageStoreController = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const user = await verifyUserForOwner(userId);
		const storeInputParsed = storeInputValidate.safeParse(req.body.storeInput);
		if (!storeInputParsed.success) {
			res.status(400).json({
				message: "Invalid request",
				errors: {
					store: storeInputParsed.error?.errors,
				},
			});
		}
		if (!storeInputParsed.success || !storeInputParsed.data) {
			throw new Error("Invalid store input");
		}
		const { name, groupId } = storeInputParsed.data;

		const store = await createStore(name, groupId);
		const userStore = await createUserStore(userId, store.id, user.role);

		res.json({ ok: true, user, store });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateStoreNameControler = async (req: Request, res: Response) => {
	try {
		const userId = req.userId as string;
		const storeId = req.storeId as string;
		await verifyUserStoreForOwnerAndManager(userId, storeId);

		const bodyParesed = updateStoreNameValidate.parse(req.body);
		if (!bodyParesed.name) {
			res.status(400).json({
				message: "Invalid request",
			});
			return;
		}
		const updateName = bodyParesed.name;

		await updateStoreName(storeId, updateName);

		res.status(200).json({ ok: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
