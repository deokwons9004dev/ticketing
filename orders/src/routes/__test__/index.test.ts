import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id   : new mongoose.Types.ObjectId().toHexString(),
	});
	await ticket.save();
	
	return ticket;
}

it('fetches orders for an particular user', async () => {
	
	// Create 3 tickets (using the ticket model)
	const tk1 = await buildTicket();
	const tk2 = await buildTicket();
	const tk3 = await buildTicket();
	
	const user1 = global.signin();
	const user2 = global.signin();
	
	// Create 1 order as User #1
	await request(app)
		.post('/api/orders')
		.set('Cookie', user1)
		.send({ ticketId: tk1.id })
		.expect(201);
	
	// Create 2 orders as User #2
	const { body: order1 } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({ ticketId: tk2.id })
		.expect(201);
	const { body: order2 } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({ ticketId: tk3.id })
		.expect(201);
	
	// Make request to get orders for User #2
	const res = await request(app)
		.get('/api/orders')
		.set('Cookie', user2)
		.expect(200);
	
	// Expect to only get orders for User #2
	// console.log(res.body);
	expect(res.body.length).toEqual(2);
	expect(res.body[0].id).toEqual(order1.id);
	expect(res.body[1].id).toEqual(order2.id);
	expect(res.body[0].ticket.id).toEqual(tk2.id);
	expect(res.body[1].ticket.id).toEqual(tk3.id);
});