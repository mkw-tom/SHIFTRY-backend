import type { Request, Response } from "express";
import {
	createStore,
	deleteStore,
	getStoreByName,
	getStores,
	updateStoreName,
} from "../services/store.service";
import type { createStoreType } from "../types/storeType";

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

export const getStoreByNameController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { name } = req.params;

		if (!name) {
			res.status(404).json({ error: "Store name is undefined" });
			return;
		}
		// if (/^\d+$/.test(name) || /^[^a-zA-Z0-9]+$/.test(name)) {
		//   return res.status(400).json({ error: "Store name cannot be only numbers" });
		// }

		const stores = await getStoreByName(name);
		if (!stores) {
			res.status(404).json({ error: "store is not found" });
			return;
		}
		res.status(200).json(stores);
	} catch (error) {
		res.status(500).json({ error: "faild get stores" });
	}
};

export const craeteStoreController = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { name, groupId, storeId } = req.body;

		if (!name || !groupId) {
			res.status(400).json({ error: "Missing required fields" });
			return;
		}
		const data: createStoreType = {
			name: name,
			groupId: groupId,
			storeId: storeId,
		};
		const store = await createStore(data);
		res.status(200).json(store);
	} catch (error) {
		res.status(500).json({ error: "faild create store" });
	}
};

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
