// id        String   @id @default(uuid())
// groupId   String   @unique 
// name      String   @unique
// createdAt DateTime @default(now())
// updatedAt DateTime @default(now())

export interface StoreType {
  id: string
  groupId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface createStoreType {
  groupId: string
  name: string
}