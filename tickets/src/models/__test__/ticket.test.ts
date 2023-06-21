import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
	// Create an instance of a ticket.
	const ticket = Ticket.build({
		title : 'concert',
		price : 5,
		userId: '123'
	});
	
	// Save the ticket to the DB.
	await ticket.save();
	
	// Fetch the ticket twice.
	const first  = await Ticket.findById(ticket.id);
	const second = await Ticket.findById(ticket.id);
	
	// Make two separate changes to each ticket.
	first!.set({ price: 10 });
	second!.set({ price: 15 });
	
	// Save the first fetched ticket.
	await first!.save();
	
	// Save the second fetched ticket and expect error.
	try {
		await second!.save();
	} 
	catch (err) {
		return;
	}
	
	throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
	const ticket = Ticket.build({
		title : 'concert',
		price : 20,
		userId: '123'
	});
	
	await ticket.save();
	expect(ticket.version).toEqual(0);
	
	await ticket.save();
	expect(ticket.version).toEqual(1);
	
	await ticket.save();
	expect(ticket.version).toEqual(2);
	
});