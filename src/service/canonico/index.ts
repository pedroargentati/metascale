/** Errors */
import { IntegrationError } from '../../errors/IntegrationError';

/** Client Operations */
import DynamoDBService from '../../dynamodb/DynamoDBService';
import { fetchDataController } from '../client/client';

/** Métodos de Validações/Processamento de dados. */
import { IParametro } from '../../interfaces/parametros';
import { CANONICO_STATUS_ATIVO, CANONICO_STATUS_INATIVO } from '../../utils/constants';
import { processCanonicoDataService } from './etl/etl-processor';
import { validateCanonico } from './validations/validations';
import { reproccessCanonical, synchronizeCanonical } from '@internal/canonical-builder';
import logger from '../../config/logger/logger';

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

/**
 * @description Carrega o canônico.
 *
 * @param {string} id - ID do canônico.
 * @param {any} dadosParametros - Dados dos parâmetros.
 * @returns Canônico.
 */
export const loadCanonicoService = async (id: string, dadosParametros: any): Promise<any> => {
	try {
		const canonicoExistente = await getCanonicoByIdService(id);

		const { chamadas } = canonicoExistente;

		const chamadasPorOrdem = new Map();
		for (const chamada of chamadas) {
			if (!chamadasPorOrdem.has(chamada.ordem)) {
				chamadasPorOrdem.set(chamada.ordem, [chamada]);
			} else {
				chamadasPorOrdem.get(chamada.ordem).push(chamada);
			}
		}

		const responses: any[] = [];
		for (const ordem of chamadasPorOrdem.keys()) {
			try {
				const chamadasDaOrdem = chamadasPorOrdem.get(ordem);

				const requisicoesDisparadas = chamadasDaOrdem.map(
					(chamada: { url: string; parametros: IParametro[]; nome: string }) =>
						fetchDataController(chamada.url, chamada.parametros, dadosParametros[chamada.nome]),
				);

				const resolvedResponses = await Promise.all(requisicoesDisparadas).catch((error) => {
					throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
				});

				responses.push(...resolvedResponses);
			} catch (error: any) {
				throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
			}
		}

		let dadoCanonico = await processCanonicoDataService(canonicoExistente, responses, dadosParametros);

		const dynamoDBServiceForCanonicoData: DynamoDBService = new DynamoDBService(canonicoExistente.nome);
		await dynamoDBServiceForCanonicoData.putItem(dadoCanonico);

		return dadoCanonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao carregar o canônico de ID ${id}: ${error.message}`, 500);
	}
};

/**
 * @description Sincroniza o canônico.
 *
 * @param canonico Canônico a ser sincronizado.
 * @param kafkaMessage Mensagem a ser consumida no kafka.
 */
export async function sincronizaCanonicoService(canonico: any, kafkaMessage: any): Promise<any> {
	logger.info(
		`[SERVICE :: Canonico] Iniciando sincronização do canônico ${canonico.nome} do tópico ${kafkaMessage.name}...`,
	);
	try {
		await synchronizeCanonical(canonico, kafkaMessage);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao sincronizar o canônico de ID ${canonico?.id}: ${error.message}`, 500);
	} finally {
		logger.info(
			`[SERVICE :: Canonico] Fim da sincronização do canônico ${canonico.nome} do tópico ${kafkaMessage.name}.`,
		);
	}
}

/**
 * @description Reprocessa o canônico.
 *
 * @param id ID do canônico.
 * @param payloadReprocessamento Payload de reprocessamento.
 */
export async function reprocessaCanonicoService(id: string, payloadReprocessamento: any) {
	try {
		const canonicoExistente = await getCanonicoByIdService(id);

		await reproccessCanonical(canonicoExistente, payloadReprocessamento);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao reprocessar o canônico de ID ${id}: ${error.message}`, 500);
	}
}

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
