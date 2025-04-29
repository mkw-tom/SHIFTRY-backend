import type { Payment } from "@prisma/client";

export interface CancelRevertResponse {
	ok: true;
	revertPayment: Payment;
}
