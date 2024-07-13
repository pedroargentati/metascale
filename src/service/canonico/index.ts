import { get, getOne, update } from '../../dao';

const CANONICO_COLLECTION: string = 'canonico';

export const getCanonicoService = async (): Promise<any> => {
	const canonicos = await get(CANONICO_COLLECTION);
	return canonicos;
};

export const getCanonicoByIdService = async (id: string): Promise<any> => {
	try {
		const canonicos = await getOne(CANONICO_COLLECTION, id);
		if (!canonicos) {
			throw new Error('Canônico não encontrado');
		}
		return canonicos;
	} catch (error: any) {
		throw new Error(`Erro ao buscar o canônico: ${error.message}`);
	}
};

export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const result = await update(CANONICO_COLLECTION, id, data);
		if (result.modifiedCount === 0) {
			throw new Error('Nenhum documento foi atualizado');
		}
		return result;
	} catch (error: any) {
		throw new Error(`Erro ao atualizar o canônico: ${error.message}`);
	}
};
