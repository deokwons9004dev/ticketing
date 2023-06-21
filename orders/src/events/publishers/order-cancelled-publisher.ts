import { Publisher, OrderCancelledEvent, Subjects } from "@deokwons9004ms/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}