import { Subjects, Publisher,ExpirationCompleteEvent } from "@deokwons9004ms/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	
	readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
	
}