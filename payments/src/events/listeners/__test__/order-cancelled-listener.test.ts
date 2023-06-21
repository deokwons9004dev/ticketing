import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@deokwons9004ms/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
	// create an instance of the listener.
	const listener = new OrderCancelledListener(natsWrapper.client);
	
	const order = Order.build({
		id     : new mongoose.Types.ObjectId().toHexString(),
		status : OrderStatus.Created,
		price  : 10,
		userId : 'asdaf',
		version: 0
	});
	await order.save();
	
	// create a fake data event.
	const data: OrderCancelledEvent['data'] = {
		version  : 1,
		id       : order.id,
		ticket   : { id: 'sdfsdf' }
	};
	
	// create a fake message object.
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};
	
	return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
	const { listener, data, msg, order } = await setup();
	
	// call the onMessage function with the data object + message object.
	await listener.onMessage(data, msg);
	
	// write assertions to make sure a ticket was created.
	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder).toBeDefined();
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();
	
	// call the onMessage function with the data object + message object.
	await listener.onMessage(data, msg);
	
	// write assertions to make sure ack function is called.
	expect(msg.ack).toHaveBeenCalled();
});