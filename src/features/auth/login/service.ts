import { getStoreFromUser } from "../../../repositories/userStore.repository";
import { verifyUser } from "../../common/authorization.service";
import type { LoginServiceResponse } from "./type";

const login = async (userId: string): Promise<LoginServiceResponse> => {
	const user = await verifyUser(userId);
	const stores = (await getStoreFromUser(userId)).map((s) => s.store);

	// const store = await getStoreById(userStore.storeId);
	if (!stores) throw new Error("Store not found");

	return { user, stores };
};

export default login;
