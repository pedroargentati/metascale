import { Request, Response } from 'express';
import { getCanonicoByIdService, getCanonicoService, updateCanonicoService } from '../service/canonico';
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

// PUT
export async function updateCanonico(req: Request, res: Response): Promise<any> {
	console.log('[ROUTES :: Canonico] Iniciando updateCanonico.');
	const { id } = req.params;
	const data = req.body;
	try {
		if (!data || !Object.keys(data).length) {
			throw new IntegrationError('O corpo da requisição não pode estar vazio.', 400);
		}

		const result = await updateCanonicoService(id, data);
		res.status(200).send(result);
	} catch (error: any) {
		console.error(`[ROUTES :: Erro ao atualizar o canônico com ID  ${id}: ${error.message}`);
		throw new IntegrationError(`Erro ao atualizar o canônico com ID ${id}: ${error.message}`, error.statusCode);
	}
}

// DELETE (?)

// /canonico/:id/load
