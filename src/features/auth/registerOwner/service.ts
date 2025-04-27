import { createStore } from "../../../repositories/store.repository";
import { upsertUser } from "../../../repositories/user.repository";
import { createUserStore } from "../../../repositories/userStore.repository";
import type { RegisterOwnerServiceResponse, UpsertUserInput } from "./type";

const registerOwner = async (
	userInput: UpsertUserInput,
	storeInput: { name: string; groupId: string },
): Promise<RegisterOwnerServiceResponse> => {
	const user = await upsertUser(userInput);
	if (!user) throw new Error("Failed to create user");

	// store作成
	const store = await createStore(storeInput.name, storeInput.groupId);
	if (!store) throw new Error("Failed to create store");

	// userStoreにオーナー登録
	await createUserStore(user.id, store.id, "OWNER");

	return { user, store };
};

export default registerOwner;
