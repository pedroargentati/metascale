/** DAO Operations */
import { get, getOne, insert, update } from '../../dao';

/** Errors */
import { IntegrationError } from '../../errors/IntegrationError';

/** Interfaces */
import { IParametro } from '../../interfaces/parametros';

/** Client Operations */
import { fetchDataController } from '../client/client';
import DynamoDBService from '../client/dynamodb/DynamoDBService';

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

		for (const chamada of chamadas) {
			try {
				const vivoServiceResult = await fetchDataController(chamada.url, chamadas.parametros as IParametro[]);
			} catch (error: any) {
				throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
			}
		}

		const dynamoDBService: DynamoDBService = DynamoDBService.getInstance('Canonicos');
		/** inclui o canônico no dynamo. */
		const result = await dynamoDBService.addItem(data);

		return result;
	} catch (error: any) {
		throw new IntegrationError(error.message, 500);
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

/** Métodos Validadores */
export const validateCanonico = (data: any): void => {
	if (!data || !Object.keys(data).length) {
		throw new IntegrationError('O corpo da requisição não pode estar vazio.', 400);
	}

	if (!data.nome || !data.descricao || !data.chamadas) {
		throw new IntegrationError('Os campos nome, descrição e chamadas são obrigatórios.', 400);
	}

	const { chamadas } = data;

	if (!Array.isArray(chamadas) || !chamadas.length) {
		throw new IntegrationError('O campo chamadas deve ser um array e não pode estar vazio.', 400);
	}

	for (const chamada of chamadas) {
		if (
			!chamada.ordem ||
			!chamada.nome ||
			!chamada.url ||
			!chamada.descricao ||
			!chamada.parametros ||
			!chamada.estrutura
		) {
			throw new IntegrationError(
				'Os campos ordem, nome, url, descrição, parametros e estrutura são obrigatórios.',
				400,
			);
		}

		const { parametros, estrutura } = chamada;

		if (!Array.isArray(parametros) || !parametros.length) {
			throw new IntegrationError('O campo parametros deve ser um array e não pode estar vazio.', 400);
		}

		if (!Array.isArray(estrutura) || !estrutura.length) {
			throw new IntegrationError('O campo estrutura deve ser um array e não pode estar vazio.', 400);
		}
	}
};
