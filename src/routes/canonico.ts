import { Request, Response } from 'express';
import { getCanonicoService } from '../service/canonico';

export async function get(req: Request, res: Response) {
	res.send('Bem-vindo à API!');
}

// GET ALL

export async function getAllCanonico(req: Request, res: Response): Promise<any> {
	try {
		const canonicos = await getCanonicoService();
		canonicos?.length ? res.status(204) : res.status(200).send(canonicos);
	} catch (error: any) {
		res.status(500).send('Erro ao buscar os canônicos: ' + error);
	}
}

// GET BY ID
// POST
// PUT
// DELETE (?)

// /canonico/:id/load
