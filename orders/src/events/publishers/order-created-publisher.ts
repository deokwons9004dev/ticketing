import { Publisher, OrderCreatedEvent, Subjects } from "@deokwons9004ms/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}