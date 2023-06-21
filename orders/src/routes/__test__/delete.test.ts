import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it('marks an order as cancelled', async () => {
	// Create a ticket.
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id   : new mongoose.Types.ObjectId().toHexString(),
	});
	await ticket.save();
	
	// Make a request to build an order with this ticket.
	const user = global.signin();
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);
	
	// Make request to cancel the order.
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);
	
	// Expect the ticket to be cancelled.
	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
	// Create a ticket.
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id   : new mongoose.Types.ObjectId().toHexString(),
	});
	await ticket.save();
	
	// Make a request to build an order with this ticket.
	const user = global.signin();
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);
	
	// Make request to cancel the order.
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);
		
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});