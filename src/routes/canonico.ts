import { Request, Response } from 'express';
import { getCanonicoByIdService, getCanonicoService } from '../service/canonico';

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
		res.status(500).send(`Erro ao buscar os canônicos: ${error}`);
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
		console.error(`[ROUTES :: Canonico] Erro ao buscar  com ID ${id}: ${error.message}`);
		res.status(500).send(`Erro ao buscar o canônico com ID ${id}: ${error.message}`);
	}
}

// POST

// PUT
// DELETE (?)

// /canonico/:id/load
