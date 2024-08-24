import { Request, Response, NextFunction } from 'express';
import { IntegrationError } from '../errors/IntegrationError';
import { errorHandler } from './globalExptionHandler';
import { CumulativeIntegrationError } from '../errors/CumulativeIntegrationError';

describe('errorHandler middleware', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		mockNext = jest.fn();
	});

	it('should handle IntegrationError correctly', () => {
		const error = new IntegrationError('Integration error occurred', 404);

		errorHandler(error as Error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 404,
			message: 'Integration error occurred',
		});
	});

	it('should handle CumulativeIntegrationError correctly', () => {
		const integrationError1 = new IntegrationError('Validation error 1', 400);
		const integrationError2 = new IntegrationError('Validation error 2', 400);
		const error = new CumulativeIntegrationError([integrationError1, integrationError2]);

		errorHandler(error as unknown as Error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 400,
			message: 'Erros de validação encontrados: ',
			errors: ['Validation error 1', 'Validation error 2'],
		});
	});

	it('should handle generic errors with a 500 status code', () => {
		const error = new Error('Generic error');

		errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 'error',
			message: 'O sistema encontrou um erro inesperado. Entre em contato com o Administrador!',
			error: error,
		});
	});
});
