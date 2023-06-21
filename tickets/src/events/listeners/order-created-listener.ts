import { Listener, OrderCreatedEvent, Subjects } from "@deokwons9004ms/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	
	readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
	readonly queueGroupName: string = queueGroupName;
	
	async onMessage (data:OrderCreatedEvent['data'], msg:Message) {
		// find the ticket that the order is reserving.
		const ticket = await Ticket.findById(data.ticket.id);
		
		// if no ticket throw error.
		if (!ticket) {
			throw new Error('Ticket not found');
		}
		
		// mark the ticket as being reserved by setting its orderId prop.
		ticket.set({ orderId: data.id });
		
		// save the ticket.
		await ticket.save();
		
		// publish the ticket updated event.
		await new TicketUpdatedPublisher(this.client).publish({
			id      : ticket.id,
			version : ticket.version,
			title   : ticket.title,
			price   : ticket.price,
			userId  : ticket.userId,
			orderId : ticket.orderId, 
		});
		
		// ack the message.
		msg.ack();
	}
}