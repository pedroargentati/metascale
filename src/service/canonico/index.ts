/** DAO Operations */
import { get, getOne, insert, update } from '../../dao';

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

		const { chamadas } = data;
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
		throw error;
	}
};

export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		if (!data || !Object.keys(data).length) {
			throw new IntegrationError('O corpo da requisição não pode estar vazio.', 400);
		}

		const result = await update(CANONICO_COLLECTION, id, data);
		if (result.modifiedCount === 0) {
			throw new IntegrationError('Nenhum documento foi atualizado', 500);
		}
		return result;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};
