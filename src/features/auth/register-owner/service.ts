import { createStore } from "../../../repositories/store.repository";
import { upsertUser } from "../../../repositories/user.repository";
import { createUserStore } from "../../../repositories/userStore.repository";
import type { RegisterOwnerServiceResponse, UpsertUserInput } from "./type";
import type { StoreNameType } from "./validation";

const registerOwner = async (
	userInput: UpsertUserInput,
	storeInput: StoreNameType,
): Promise<RegisterOwnerServiceResponse> => {
	const user = await upsertUser(userInput);
	const store = await createStore(storeInput.name);
	const userStore = await createUserStore(user.id, store.id, "OWNER");

	return { user, store, userStore };
};

export default registerOwner;
