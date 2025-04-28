import type { Store } from "@prisma/client";

export interface UpdateStoreNameResponse {
  ok: true;
  store: Store;
}
