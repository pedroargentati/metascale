import e, { Request, Response } from 'express';
import {
	createCanonicoService,
	getCanonicoByIdService,
	getCanonicoService,
	updateCanonicoService,
} from '../service/canonico';
import { IntegrationError } from '../errors/IntegrationError';

export async function get(req: Request, res: Response) {
	res.send('Bem-vindo à API!');
}

// GET ALL

export async function getAllCanonico(req: Request, res: Response): Promise<any> {
	console.log('[ROUTES :: Canonico] Iniciando getAllCanonico.');
	try {
		const canonicos = await getCanonicoService();
		res.status(200).send(canonicos);
	} catch (error: any) {
		console.error(`[ROUTES :: Canonico] Erro ao buscar os canônicos: ${error}`);
		throw new IntegrationError(error.message, error.statusCode);
	}
}

// GET BY ID

export async function getCanonicoById(req: Request, res: Response): Promise<any> {
	console.log('[ROUTES :: Canonico] Iniciando getCanonicoById.');
	const { id } = req.params;
	try {
		const canonicos = await getCanonicoByIdService(id);
		res.status(200).send(canonicos);
	} catch (error: any) {
		console.error(`[ROUTES :: Canonico] Erro ao buscar com ID ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao buscar o canônico com ID ${id}: ${error.message}`, error.statusCode);
	}
}

// POST
export async function createCanonico(req: Request, res: Response): Promise<any> {
	console.log('[ROUTES :: Canonico] Iniciando createCanonico.');
	const data = req.body;
	try {
		const result = await createCanonicoService(data);
		res.status(201).send(result);
	} catch (error: any) {
		console.error(`[ROUTES :: Erro ao criar o canônico: ${error.message}`);
		throw new IntegrationError(`Erro ao criar o canônico: ${error.message}`, error.statusCode);
	}
}

// PUT
export async function updateCanonico(req: Request, res: Response): Promise<any> {
	console.log('[ROUTES :: Canonico] Iniciando updateCanonico.');
	const { id } = req.params;
	const data = req.body;
	try {
		const result = await updateCanonicoService(id, data);
		res.status(200).send(result);
	} catch (error: any) {
		console.error(`[ROUTES :: Erro ao atualizar o canônico com ID  ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao atualizar o canônico com ID ${id}: ${error.message}`, error.statusCode);
	}
}

// DELETE (?)

// /canonico/:id/load
