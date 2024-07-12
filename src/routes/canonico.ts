import { Request, Response } from 'express';
import { getCanonicoService } from '../service/canonico';

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
// POST
// PUT
// DELETE (?)

// /canonico/:id/load
