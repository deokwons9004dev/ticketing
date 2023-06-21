import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222'
});

stan.on('connect', () => {
	console.log('Listener connected to NATS.');
	
	stan.on('close', () => {
		console.log('NATS connection closed.');
		process.exit();
	});
	
	new TicketCreatedListener(stan).listen();
	
	// const opt = stan.subscriptionOptions()
	// 	.setManualAckMode(true)
	// 	.setDeliverAllAvailable()
	// 	.setDurableName('accounting-service');
	// 	// .setMaxInFlight()
	// 	// .setDeliverAllAvailable()
	// 	// .setDurableName()
	
	// const sub = stan.subscribe(
	// 	'ticket:created', 
	// 	'queue-group-name',
	// 	opt
	// );
	
	// sub.on('message', (msg:Message) => {
	// 	const data = msg.getData();
		
	// 	if (typeof data === 'string') {
	// 		// console.log(`Received event #${msg.getSequence()}, with data: ${JSON.parse(data)}`);
	// 		console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
	// 	}
		
	// 	msg.ack();
	// });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




