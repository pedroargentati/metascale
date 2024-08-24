import { Request, Response, NextFunction } from 'express';
import { IntegrationError } from '../errors/IntegrationError';
import { errorHandler } from './globalExptionHandler'; // ajuste o caminho conforme necessário
import { CumulativeIntegrationError } from '../errors/CumulativeIntegrationError';

describe('Middleware errorHandler', () => {
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

	it('deve tratar IntegrationError corretamente', () => {
		const error = new IntegrationError('Erro de integração ocorreu', 404);

		errorHandler(error as Error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 404,
			message: 'Erro de integração ocorreu',
		});
	});

	it('deve tratar CumulativeIntegrationError corretamente com múltiplos erros', () => {
		const integrationError1 = new IntegrationError('Erro de validação 1', 400);
		const integrationError2 = new IntegrationError('Erro de validação 2', 400);
		const error = new CumulativeIntegrationError([integrationError1, integrationError2]);

		errorHandler(error as unknown as Error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 400,
			message: 'Erros de validação encontrados: ',
			errors: ['Erro de validação 1', 'Erro de validação 2'],
		});
	});

	it('deve tratar CumulativeIntegrationError corretamente com exceptions como undefined', () => {
		// Teste para quando exceptions é undefined
		const error = new CumulativeIntegrationError(undefined as unknown as IntegrationError[]);

		errorHandler(error as unknown as Error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 400,
			message: 'Erros de validação encontrados: ',
			errors: undefined, // Deve retornar undefined ou vazio
		});
	});

	it('deve tratar erros genéricos com código de status 500', () => {
		const error = new Error('Erro genérico');

		errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: 'error',
			message: 'O sistema encontrou um erro inesperado. Entre em contato com o Administrador!',
			error: error,
		});
	});
});
