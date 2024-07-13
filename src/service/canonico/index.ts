import { get, getOne, update } from '../../dao';
import { IntegrationError } from '../../errors/IntegrationError';

const CANONICO_COLLECTION: string = 'canonico';

export const getCanonicoService = async (): Promise<any> => {
	try {
		const canonicos = await get(CANONICO_COLLECTION);
		if (!canonicos || !canonicos.length) {
			throw new IntegrationError('Canônicos não encontrados.', 204);
		}
		return canonicos;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao buscar os canônicos: ${error.message}`, 500);
	}
};

export const getCanonicoByIdService = async (id: string): Promise<any> => {
	try {
		const canonicos = await getOne(CANONICO_COLLECTION, id);
		if (!canonicos) {
			throw new IntegrationError('Canônico não encontrado', 404);
		}
		return canonicos;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao buscar o canônico: ${error.message}`, 500);
	}
};

export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const result = await update(CANONICO_COLLECTION, id, data);
		if (result.modifiedCount === 0) {
			throw new IntegrationError('Nenhum documento foi atualizado', 500);
		}
		return result;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};
