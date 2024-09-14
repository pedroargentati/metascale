import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger/logger.js';

/**
 * Middleware para logar requisições recebidas.
 * Registra o método HTTP, URL e código de status da resposta de cada requisição.
 *
 * @param {Request} request - O objeto da requisição recebida.
 * @param {Response} response - O objeto de resposta.
 * @param {NextFunction} next - A próxima função de middleware.
 */
export const logRequest = (request: Request, response: Response, next: NextFunction) => {
	logger.info(`Requisição :: Método: ${request.method} :: URL: ${request.url} :: Status: ${response.statusCode}`);
	next();
};

/**
 * Middleware para logar erros.
 * Registra o método HTTP, URL, código de status da resposta e a pilha de erros.
 * Envia uma resposta de status 500 com uma mensagem de erro genérica.
 *
 * @param {Error} error - O objeto de erro.
 * @param {Request} request - O objeto da requisição recebida.
 * @param {Response} res - O objeto de resposta.
 * @param {NextFunction} next - A próxima função de middleware.
 */
export const logError = (error: Error, request: Request, response: Response, next: NextFunction) => {
	logger.error(`[ERRO] :: Método: ${request.method} :: URL: ${request.url} :: Status: ${response.statusCode}`, {
		stack: error.stack,
	});
};
