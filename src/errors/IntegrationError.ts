export class IntegrationError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;

		Object.setPrototypeOf(this, IntegrationError.prototype);
	}
}
