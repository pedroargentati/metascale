import { Request, Response } from 'express';
import { getCanonicoBanco } from '../dao/canonico/index';
import { getCanonicoService } from '../service/canonico';

export async function get(req: Request, res: Response) {
	res.send('Bem-vindo à API!');
}

// GET ALL

export async function getAllCanonico(req: Request, res: Response): Promise<any> {
	try {
		const canonicos = await getCanonicoService();
		res.send(canonicos);
	} catch (error: any) {
		res.status(500).send('Erro ao buscar os canônicos');
	}
}

// GET BY ID
// POST
// PUT
// DELETE (?)

// /canonico/:id/load
