import type { Payment } from "@prisma/client";

export interface CreatePaymentResponse {
	ok: true;
	payment: Payment;
}
