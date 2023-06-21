import { Publisher, Subjects, TicketUpdatedEvent } from '@deokwons9004ms/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}