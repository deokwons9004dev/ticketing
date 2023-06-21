import { Publisher, PaymentCreatedEvent, Subjects } from "@deokwons9004ms/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}