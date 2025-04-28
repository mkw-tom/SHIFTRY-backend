import { upsertUser } from "../../../repositories/user.repository";
import { createUserStore } from "../../../repositories/userStore.repository";
import { verifyStoreIdAndShiftRequestId } from "../../common/authorization.service";
import type { RegisterStaffServiceResponse, UpsertUserInput } from "./type";
import type { storeIdandShfitReruestIdType } from "./validation";

export const registerStaff = async (
	userInput: UpsertUserInput,
	storeInput: storeIdandShfitReruestIdType,
): Promise<RegisterStaffServiceResponse> => {
	const { storeId, shiftRequestId } = storeInput;
	const store = await verifyStoreIdAndShiftRequestId(storeId, shiftRequestId);
	if (!store) throw new Error("Failed to get store data");
	const user = await upsertUser(userInput);
	const userStore = await createUserStore(user.id, store.id, "STAFF");

	return { user, store, userStore };
};
