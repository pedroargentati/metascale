import { Request, Response, NextFunction } from 'express';
import { IntegrationError } from '../errors/IntegrationError.js';
import { CumulativeIntegrationError } from '../errors/CumulativeIntegrationError.js';

/**
 * Middleware de tratamento de erros globais.
 * Captura e trata erros específicos e erros gerais.
 *
 * @param {Error} err Erro capturado.
 * @param {Request} req Requisição.
 * @param {Response} res Resposta.
 * @param {NextFunction} next Próximo middleware.
 * @returns Resposta de erro
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof IntegrationError) {
		// Tratamento específico para erros customizados
		return res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
		});
	} else if (err instanceof CumulativeIntegrationError) {
		// Tratamento específico para erros customizados
		return res.status(400).json({
			status: 400,
			message: 'Erros de validação encontrados: ',
			errors: err.exceptions?.map((exception) => exception.message),
		});
	}

	res.status(500).json({
		status: 'error',
		message: 'O sistema encontrou um erro inesperado. Entre em contato com o Administrador!',
		error: err,
	});
};
