import type { Request, Response } from "express";
import {
	createStore,
	deleteStore,
	getStoreStaffs,
	getStores,
	getStoresByOwner,
	updateStoreName,
} from "../repositories/store.repository";
import type { createStoreType } from "../types/storeType";

//✅ 全ての店舗一覧を取得
export const getStoresController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const stores = await getStores();
		res.status(200).json(stores);
	} catch (error) {
		res.status(500).json({ error: "faild get stores" });
	}
};

//✅ 店舗IDからスタッフ達の情報を取得
export const getStoreStaffsController = async (req: Request, res: Response) => {
	try {
		const { storeId } = req.params;

		if (!storeId) {
			return res.status(400).json({ error: "storeId が必要です" });
		}

		const staffs = await getStoreStaffs(storeId);
		return res.json(staffs);
	} catch (error) {
		console.error("❌ スタッフ取得エラー:", error);
		return res.status(500).json({ error: "faild get staffs" });
	}
};

//✅ オーナーIDから店舗情報を取得
export const getStoresByOwnerController = async (
	req: Request,
	res: Response,
) => {
	try {
		const { ownerId } = req.params;

		if (!ownerId) {
			res.status(400).json({ error: "ownerId is undefined" });
			return;
		}

		const stores = await getStoresByOwner(ownerId);
		res.status(200).json(stores);
	} catch (error) {
		res.status(500).json({ error: "faild get stores" });
	}
};

//✅ 店舗を新規作成
export const craeteStoreController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { name, groupId } = req.body;

		if (!name || !groupId) {
			res.status(400).json({ error: "Missing required fields" });
			return;
		}
		const data: createStoreType = {
			name: name,
			groupId: groupId,
		};
		const store = await createStore(data);
		res.status(200).json(store);
	} catch (error) {
		res.status(500).json({ error: "faild create store" });
	}
};

//✅ 店舗名を更新
export const updateStoreNameController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { storeId } = req.params;
		const { name } = req.body;

		if (!storeId || !name) {
			res.status(400).json({ error: "missing require field" });
			return;
		}

		const updatedStore = await updateStoreName(storeId, name);
		res.status(200).json(updatedStore);
	} catch (error) {
		res.status(500).json({ error: "faild update store name" });
	}
};

//✅ 店舗を削除
export const deleteStoreController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { storeId } = req.params;

		if (!storeId) {
			res.status(404).json({ error: "storeId is undefined" });
			return;
		}

		const stores = await deleteStore(storeId);
		res.status(200).json(stores);
	} catch (error) {
		res.status(500).json({ error: "faild delete stores" });
	}
};
