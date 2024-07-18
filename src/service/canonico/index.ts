/** DAO Operations */
import { deleteOne, get, getOne, insert, update } from '../../dao';

/** Errors */
import { IntegrationError } from '../../errors/IntegrationError';

/** Client Operations */
import { fetchDataController } from '../client/client';
import DynamoDBService from '../client/dynamodb/DynamoDBService';

/** Métodos de Validações/Processamento de dados. */
import { processCanonicoData } from './etl/etl-processor';
import { validateCanonico } from './validations/validations';

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

/**
 * Realiza toda a lógica de validação, chamada de serviços e persistência de um canônico no DynamoDB.
 *
 * @param data - Dados do canônico a ser criado.
 * @returns Promessa resolvendo em objeto contendo o canônico criado.
 */
export const createCanonicoService = async (data: any): Promise<any> => {
	try {
		validateCanonico(data);
		const result = await insert(CANONICO_COLLECTION, data);
		const newId = result.insertedId;
		return await getOne(CANONICO_COLLECTION, newId);
	} catch (error: any) {
		throw error;
	}
};

const getCanonicoExistente = async (id: string): Promise<any> => {
	const canonicoExistente = await getOne(CANONICO_COLLECTION, id);
	if (!canonicoExistente) {
		throw new IntegrationError('Canônico não encontrado', 404);
	}
	return canonicoExistente;
};

export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		await getCanonicoExistente(id);

		validateCanonico(data);

		// TODO: Agendar reprocessamento de canonicos já inseridos na estrutura anterior

		await update(CANONICO_COLLECTION, id, data);

		return await getOne(CANONICO_COLLECTION, id);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};

export const deleteCanonicoService = async (id: string): Promise<any> => {
	try {
		await getCanonicoExistente(id);
		await deleteOne(CANONICO_COLLECTION, id);
		return true;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao deletar o canônico: ${error.message}`, 500);
	}
};

export const loadCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const canonicoExistente = await getCanonicoExistente(id);

		const { chamadas } = canonicoExistente;
		const responses = [];

		for (const chamada of chamadas) {
			try {
				const vivoServiceResult = await fetchDataController(chamada.url, chamada.parametros);
				responses.push(vivoServiceResult);
			} catch (error: any) {
				throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
			}
		}

		// Processamento e montagem do canônico usando os metadados
		const processedData = processCanonicoData(data, responses);

		const dynamoDBService: DynamoDBService = DynamoDBService.getInstance('Canonicos');
		const result = await dynamoDBService.addItem(processedData);

		return result;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao carregar o canônico de ID ${id}: ${error.message}`, 500);
	}
};
