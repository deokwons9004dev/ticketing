import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@deokwons9004ms/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
	// create an instance of the listener.
	const listener = new OrderCancelledListener(natsWrapper.client);
	
	// create and save a ticket.
	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title : 'concert',
		price : 99,
		userId: 'asdf'
	});
	ticket.set({ orderId });
	await ticket.save();
	
	// create a fake data event.
	const data: OrderCancelledEvent['data'] = {
		id      : orderId,
		version : 0,
		ticket  : {
			id : ticket.id,
		}
	};
	
	// create a fake message object.
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};
	
	return { listener, data, msg, ticket, orderId };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
	const { listener, data, msg, ticket, orderId } = await setup();
	
	// call the onMessage function with the data object + message object.
	await listener.onMessage(data, msg);
	
	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});