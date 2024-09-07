import { IntegrationError } from './IntegrationError.js';

export class CumulativeIntegrationError {
	public exceptions: IntegrationError[];

	constructor(exceptions: IntegrationError[]) {
		this.exceptions = exceptions;
	}
}
