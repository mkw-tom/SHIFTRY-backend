import type { Payment } from "@prisma/client";

export interface CancelSubscriptionResponse {
	ok: true;
	canceledPayment: Payment;
	cancelDate: Date;
}

export interface CancelSubscriptionServiceResponse {
	canceledPayment: Payment;
	cancelDate: Date;
}
