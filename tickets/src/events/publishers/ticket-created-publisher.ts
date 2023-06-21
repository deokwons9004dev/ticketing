import { Publisher, Subjects, TicketCreatedEvent } from '@deokwons9004ms/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}