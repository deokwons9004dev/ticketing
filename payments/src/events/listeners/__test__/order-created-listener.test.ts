import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@deokwons9004ms/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
	// create an instance of the listener.
	const listener = new OrderCreatedListener(natsWrapper.client);
	
	// create a fake data event.
	const data: OrderCreatedEvent['data'] = {
		version  : 0,
		id       : new mongoose.Types.ObjectId().toHexString(),
		expiresAt: 'asdasf',
		userId   : 'sdafsdf',
		status   : OrderStatus.Created,
		ticket   : { id: 'sdfsdf', price: 10 }
	};
	
	// create a fake message object.
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};
	
	return { listener, data, msg };
};

it('replicates the order info', async () => {
	const { listener, data, msg } = await setup();
	
	// call the onMessage function with the data object + message object.
	await listener.onMessage(data, msg);
	
	// write assertions to make sure a ticket was created.
	const order = await Order.findById(data.id);
	expect(order).toBeDefined();
	expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();
	
	// call the onMessage function with the data object + message object.
	await listener.onMessage(data, msg);
	
	// write assertions to make sure ack function is called.
	expect(msg.ack).toHaveBeenCalled();
});