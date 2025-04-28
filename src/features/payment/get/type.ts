import type { Payment } from "@prisma/client";

export interface GetPaymentResponse {
	ok: true;
	payment: Payment;
}
