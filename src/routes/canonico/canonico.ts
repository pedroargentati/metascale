import { Request, Response } from 'express';
import {
	createCanonicoService,
	deleteCanonicoService,
	getCanonicoByIdService,
	getCanonicoService,
	updateCanonicoService,
	updatePartialCanonicoService,
} from '../../service/canonico/index.js';
import { IntegrationError } from '../../errors/IntegrationError.js';
import { loadCanonicoService, reprocessaCanonicoService } from '../../service/canonico/etl/index.js';
import { logger, loggerLoad, loggerReprocess } from '../../config/logger/logger.js';

export async function get(req: Request, res: Response) {
	res.send('Bem-vindo à API!');
}

// GET ALL
export async function getAllCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando getAllCanonico.');
	try {
		const canonicos = await getCanonicoService();
		res.status(200).send(canonicos);
	} catch (error: any) {
		logger.error(`[ROUTES :: Canonico] Erro ao buscar os canônicos: ${error}`);
		throw new IntegrationError(error.message, error.statusCode);
	}
}

// GET BY ID
export async function getCanonicoById(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando getCanonicoById.');
	const { id } = req.params;
	try {
		const canonico = await getCanonicoByIdService(id);
		res.status(200).send(canonico);
	} catch (error: any) {
		logger.error(`[ROUTES :: Canonico] Erro ao buscar com ID ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao buscar o canônico com ID: ${id}: ${error.message}`, error.statusCode);
	}
}

// POST
export async function createCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando createCanonico.');
	const data = req.body;
	try {
		const result = await createCanonicoService(data);
		res.status(200).send(result);
	} catch (error: any) {
		logger.error(`[ROUTES :: Erro ao criar o canônico: ${error.message}`);
		throw error;
	}
}

// PUT
export async function updateCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando updateCanonico.');
	const { id } = req.params;
	const data = req.body;
	try {
		const result = await updateCanonicoService(id, data);
		res.status(200).send(result);
	} catch (error: any) {
		logger.error(`[ROUTES :: Erro ao atualizar o canônico com ID: ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao atualizar o canônico com ID ${id}: ${error.message}`, error.statusCode);
	}
}

// PATCH
export async function updatePartialCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando updatePartialCanonico.');
	const { id } = req.params;
	const data = req.body;
	try {
		const result = await updatePartialCanonicoService(id, data);
		res.status(200).send(result);
	} catch (error: any) {
		logger.error(`[ROUTES :: Erro ao atualizar o canônico com ID ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao atualizar o canônico com ID ${id}: ${error.message}`, error.statusCode);
	}
}

// DELETE
export async function deleteCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando deleteCanonico.');
	const { id } = req.params;
	try {
		const response = await deleteCanonicoService(id);
		res.status(200).send(response);
	} catch (error: any) {
		logger.error(`[ROUTES :: Erro ao deletar o canônico com ID ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao deletar o canônico com ID ${id}: ${error.message}`, error.statusCode);
	}
}

// LOAD
export async function loadCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando loadCanonico.');
	const { id } = req.params;
	const dadosParametros = req.body;
	try {
		const response = await loadCanonicoService(id, dadosParametros);
		res.status(200).send(response);
	} catch (error: any) {
		loggerLoad.error(`Erro ao carregar o canônico com nome ${id}: ${error.message}`);
		logger.error(`[ROUTES :: Canonico] Erro ao carregar o canônico com nome ${id}: ${error.message}`);
		throw error;
	}
}

// reprocessa
export async function reprocessaCanonico(req: Request, res: Response): Promise<any> {
	logger.debug('[ROUTES :: Canonico] Iniciando reprocessaCanonico.');
	const { id } = req.params;
	const payloadReprocessamento = req.body;
	try {
		const response = await reprocessaCanonicoService(id, payloadReprocessamento);
		res.status(200).send(response);
	} catch (error: any) {
		loggerReprocess.error(`Erro ao reprocessar o canônico com nome ${id}: ${error.message}`);
		logger.error(`[ROUTES :: Canonico] Erro ao reprocessar o canônico com nome ${id}: ${error.message}`);
		throw error;
	}
}
