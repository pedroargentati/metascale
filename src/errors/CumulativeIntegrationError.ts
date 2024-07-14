import { IntegrationError } from './IntegrationError';

export class CumulativeIntegrationError {
	public exceptions: IntegrationError[];

	constructor(exceptions: IntegrationError[]) {
		this.exceptions = exceptions;
	}
}
