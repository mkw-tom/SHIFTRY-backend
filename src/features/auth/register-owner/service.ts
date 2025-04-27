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
	if (!user) throw new Error("Failed to create user");

	// store作成
	const store = await createStore(storeInput.name);
	if (!store) throw new Error("Failed to create store");

	// userStoreにオーナー登録
	await createUserStore(user.id, store.id, "OWNER");

	return { user, store };
};

export default registerOwner;
