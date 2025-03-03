import prisma from "../config/database"
import { createStoreType, StoreType } from "../types/storeType"

export const getStores = async () => {
  return prisma.store.findMany()
}

export const getStoreByName = async (name: string) => {
  return prisma.store.findUnique({
    where: { "name": name}
  })
}

//--- オーナーが所有する店舗（複数）の取得 ---
// export const getOwnerStores = async (ownerid: string) => {

// }

export const createStore = async (data: createStoreType) => {
  return prisma.store.create({ data })
}

export const updateStoreName = async (storeId: string, name: string) => {
  return prisma.store.update({
    where: {"id": storeId},
    data: { name: name }
  })
}

export const deleteStore = async (storeId: string) => {
  return prisma.store.delete({
    where: {"id": storeId}
  })
}

