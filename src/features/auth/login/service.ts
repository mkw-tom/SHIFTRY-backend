import type { LoginServiceResponse } from "@shared/auth/types/login";
import { getStoreFromUser } from "../../../repositories/userStore.repository";
import { verifyUser } from "../../common/authorization.service";

const login = async (userId: string): Promise<LoginServiceResponse> => {
	const user = await verifyUser(userId);
	const userStoreWithStore = await getStoreFromUser(userId);
	const stores = userStoreWithStore.map((userStore) => userStore.store);

	return { user, stores };
};

export default login;
