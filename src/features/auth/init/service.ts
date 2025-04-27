import { getShiftRequestByStoreId } from "../../../repositories/shiftRequest.repository";
import { getStoreById } from "../../../repositories/store.repository";
import { getUserById } from "../../../repositories/user.repository";
import type { InitServiceResponse } from "./type";

const Init = async (
	userId: string,
	storeId: string,
): Promise<InitServiceResponse> => {
	const [user, store, shiftRequest] = await Promise.all([
		getUserById(userId),
		getStoreById(storeId),
		getShiftRequestByStoreId(storeId),
	]);
	if (!user || !store) {
		throw new Error("data is not found");
	}

	return { user, store, shiftRequest };
};

export default Init;
