import { Request, Response } from 'express';
import { getCanonicoBanco } from '../dao/canonico/index';

export async function get(req: Request, res: Response) {
	res.send('Bem-vindo à API!');
}

// GET ALL

export async function getAllCanonico(req: Request, res: Response): Promise<any> {
	const result = await getCanonicoBanco(1);
	res.send(result);
}

// GET BY ID
// POST
// PUT
// DELETE (?)

// /canonico/:id/load
