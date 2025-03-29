import type { Request, Response } from "express";
import {
	createStore,
	updateStoreGroupId,
	updateStoreName,
} from "../repositories/store.repository";
import { getUserById } from "../repositories/user.repository";
import {
	createUserStore,
	getStoreFromUser,
	getUserStoreByUserId,
	getUserStoreByUserIdAndStoreId,
} from "../repositories/userStore.repository";
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
		const bodyParesed = connectGoupIdValidate.parse(req.body);
		const groupId = bodyParesed.groupId;
		const user = await getUserById(userId);
		if (!user) throw new Error("User not found");

		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore || userStore.role !== "OWNER") {
			res.status(403).json({ message: "Only owner can update store" });
			return;
		}

		// const userStore = await getUserStoreByUserId(userId);
		// if (!userStore || userStore.role !== "OWNER") {
		// 	res.status(403).json({ message: "Only owner can update store" });
		// 	return;
		// }

		await updateStoreGroupId(userStore.storeId, groupId);
		res.json({ ok: true });
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
		const user = await getUserById(userId);
		if (!user) throw new Error("User not found");

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
		const user = await getUserById(userId);
		if (!user || user.role !== "OWNER") throw new Error("User not found");
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
		const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
		if (!userStore || userStore.role !== "OWNER") {
			res
				.status(403)
				.json({ message: "User is not authorized to perform this action" });
			return;
		}

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
