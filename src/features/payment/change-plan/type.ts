import type { Payment } from "@prisma/client";

export interface ChangePalnResponse {
	ok: true;
	updatedPayment: Payment;
}
