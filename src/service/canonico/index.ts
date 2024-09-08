/** Errors */
import { IntegrationError } from '../../errors/IntegrationError.js';

/** Client Operations */
import DynamoDBService from '../../dynamodb/DynamoDBService.js';

/** Métodos de Validações/Processamento de dados. */
import { CANONICO_STATUS_ATIVO, CANONICO_STATUS_INATIVO } from '../../utils/constants.js';
import { validateCanonico } from './validations/validations.js';

/** Constantes. */
const CANONICO_COLLECTION: string = 'canonico';

/** Serviços. */
const dynamoDBService: DynamoDBService = new DynamoDBService(CANONICO_COLLECTION);

/**
 * @description Retorna todos os canônicos ativos.
 *
 * @returns Canônicos ativos.
 */
export const getCanonicoService = async (): Promise<any> => {
	const params: Record<string, any> = {
		FilterExpression: '#statusCanonico = :statusCanonico',
		ExpressionAttributeNames: { '#statusCanonico': 'statusCanonico' },
		ExpressionAttributeValues: { ':statusCanonico': CANONICO_STATUS_ATIVO },
	};

	const canonicos = await dynamoDBService.getAllItems(params);
	if (!canonicos || !canonicos.length) {
		throw new IntegrationError('Canônicos não encontrados.', 204);
	}
	return canonicos;
};

/**
 * @description Retorna o canônico pelo ID.
 *
 * @param {string} id - ID do canônico.
 * @returns Canônico.
 */
export const getCanonicoByIdService = async (id: string): Promise<any> => {
	const canonico = await getCanonico(id);
	if (!isCanonicoValidoParaUso(canonico)) {
		throw new IntegrationError('Canônico não encontrado', 404);
	}
	return canonico;
};

/**
 * @description Cria um canônico.
 *
 * @param {any} data - Canônico a ser criado.
 * @returns Canônico.
 */
export const createCanonicoService = async (data: any): Promise<any> => {
	try {
		validateCanonico(data);
		delete data.versao;

		const canonicoComMesmoNome = await getCanonico(data.nome);
		if (canonicoComMesmoNome && canonicoComMesmoNome.statusCanonico !== CANONICO_STATUS_ATIVO) {
			throw new IntegrationError(
				`Canônico com o nome ${data.nome} já existe e está inativo. Por favor verifique com o administrador a possibilidade da sua exclusão permanente`,
				409,
			);
		} else if (canonicoComMesmoNome) {
			throw new IntegrationError(`Canônico com o nome ${data.nome} já existe`, 409);
		}

		await salvarCanonico(data);
		new DynamoDBService(data.nome).createTable();

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Atualiza o status do canônico.
 *
 * @param {string} id - ID do canônico.
 * @param {string} data - Canônico a ser atualizado parcialmente.
 * @returns Canônico.
 */
export const updatePartialCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const _ = await getCanonicoByIdService(id);

		if (data.statusCanonico) {
			await atualizaStatusDoCanonico(id, data.statusCanonico);
		}

		return await getCanonicoByIdService(id);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};

/**
 * @description Atualiza o canônico.
 *
 * @param {string} id - ID do canônico.
 * @param {string} data - Canônico a ser atualizado.
 * @returns Canônico.
 */
export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const canonicoExistente = await getCanonicoByIdService(id);

		validateCanonico(data);

		await salvarCanonico({ ...data, versao: canonicoExistente?.versao });

		return await getCanonicoByIdService(id);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};

/**
 * @description Deleta o canônico.
 *
 * @param {string} id - ID do canônico.
 * @returns Canônico.
 */
export const deleteCanonicoService = async (id: string): Promise<any> => {
	try {
		const canonico = await getCanonicoByIdService(id);

		await atualizaStatusDoCanonico(id, CANONICO_STATUS_INATIVO);

		return canonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao deletar o canônico: ${error.message}`, 500);
	}
};

/** Métodos auxiliares. */

/**
 * @description Retorna o canônico pelo ID.
 *
 * @param {string} id - ID do canônico.
 * @returns Canônico.
 */
const getCanonico = async (id: string): Promise<any> => {
	const canonico = await dynamoDBService.getItem({ nome: id });
	return canonico;
};

/**
 * @description Verifica se o canônico é válido para uso.
 *
 * @param {any} canonico - Canônico.
 * @returns {boolean} - Se o canônico é válido para uso.
 */
const isCanonicoValidoParaUso = async (canonico: any): Promise<boolean> => {
	return canonico && canonico.statusCanonico === CANONICO_STATUS_ATIVO;
};

/**
 * @description Salva um canônico no DynamoDB.
 *
 * @param {string} data - Canônico a ser salvo.
 * @returns Canônico.
 */
const salvarCanonico = async (data: any): Promise<any> => {
	data.chamadas.sort((a: any, b: any) => a.ordem - b.ordem);

	if (!data.versao) {
		data.versao = 1;
	} else {
		data.versao += 1;
	}

	data.statusCanonico = CANONICO_STATUS_ATIVO;

	await dynamoDBService.putItem(data);
};

/**
 * @description Atualiza o status do canônico.
 *
 * @param {string} id - ID do canônico.
 * @param {string} status - Status do canônico.
 * @returns Canônico.
 */
const atualizaStatusDoCanonico = async (id: string, status: string): Promise<any> => {
	const updateExpression: string = 'SET statusCanonico = :statusCanonico';
	const expressionAttributeValues: any = { ':statusCanonico': status };

	await dynamoDBService.updateItem({ nome: id }, updateExpression, expressionAttributeValues);
};
