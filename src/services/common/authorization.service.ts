import { getUserById } from "../../repositories/user.repository";
import { getUserStoreByUserIdAndStoreId } from "../../repositories/userStore.repository";

export const verifyUserStore = async (userId: string, storeId: string) => {
	const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
	if (!userStore) {
		throw new Error("User is not authorized as OWNER");
	}
	return userStore;
};

export const verifyUserStoreForOwner = async (
	userId: string,
	storeId: string,
) => {
	const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
	if (!userStore) {
		throw new Error("User is not authorized");
	}
	if (userStore.role !== "OWNER") {
		throw new Error("User is not authorized as OWNER");
	}
	return userStore;
};

export const verifyUserStoreForOwnerAndManager = async (
	userId: string,
	storeId: string,
) => {
	const userStore = await getUserStoreByUserIdAndStoreId(userId, storeId);
	if (!userStore) {
		throw new Error("User is not authorized ");
	}
	if (!userStore || userStore.role === "STAFF") {
		throw new Error("User is not authorized as Owner or Manager");
	}
	return userStore;
};

export const verifyUser = async (userId: string) => {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");
	return user;
};

export const verifyUserForOwner = async (userId: string) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new Error("User is not authorized");
	}
	if (user.role !== "OWNER") throw new Error("User is not authorized as Owner");
	return user;
};
