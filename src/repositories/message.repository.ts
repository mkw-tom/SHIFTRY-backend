import prisma from "../config/database";

//✅オーナーの中間テーブルに該当データが存在するか
export const checkIsOwnerData = async (storeId: string) => {
	return prisma.ownerStore.findFirst({
		where: { storeId: storeId },
	});
	/// データがある場合：{ ownerId: "xxxxxxx", storeId: "yyyyyy" }
	/// データがない場合： null
};

//✅店舗データを作成
export const createStoreAfterLogin = async (data: {
	groupId: string;
	name: string;
}) => {
	return prisma.store.create({ data });
};
