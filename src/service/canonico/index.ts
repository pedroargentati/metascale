/** Errors */
import { IntegrationError } from '../../errors/IntegrationError';

/** Client Operations */
import DynamoDBService from '../../dynamodb/DynamoDBService';
import { fetchDataController } from '../client/client';

/** Métodos de Validações/Processamento de dados. */
import { IParametro } from '../../interfaces/parametros';
import { CANONICO_STATUS_ATIVO, CANONICO_STATUS_INATIVO } from '../../utils/constants';
import { processCanonicoData } from './etl/etl-processor';
import { validateCanonico } from './validations/validations';
import { reproccessCanonical, synchronizeCanonical } from 'canonical-builder';

const CANONICO_COLLECTION: string = 'canonico';

const dynamoDBService: DynamoDBService = new DynamoDBService(CANONICO_COLLECTION);

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

const getCanonico = async (id: string): Promise<any> => {
	const canonico = await dynamoDBService.getItem({ nome: id });
	return canonico;
};

const isCanonicoValidoParaUso = async (canonico: any): Promise<boolean> => {
	return canonico && canonico.statusCanonico === CANONICO_STATUS_ATIVO;
};

export const getCanonicoByIdService = async (id: string): Promise<any> => {
	const canonico = await getCanonico(id);
	if (!isCanonicoValidoParaUso(canonico)) {
		throw new IntegrationError('Canônico não encontrado', 404);
	}
	return canonico;
};

const salvarCanonico = async (data: any): Promise<any> => {
	data.chamadas.sort((a: any, b: any) => a.ordem - b.ordem);

	if (!data.versao) {
		data.versao = 1;
	} else {
		data.versao += 1;
	}

	await dynamoDBService.putItem(data);
};

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

const atualizaStatusDoCanonico = async (id: string, status: string): Promise<any> => {
	const updateExpression: string = 'SET statusCanonico = :statusCanonico';
	const expressionAttributeValues: any = { ':statusCanonico': status };

	await dynamoDBService.updateItem({ nome: id }, updateExpression, expressionAttributeValues);
};

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

export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const _ = await getCanonicoByIdService(id);

		validateCanonico(data);

		await salvarCanonico(data);

		return data;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};

export const deleteCanonicoService = async (id: string): Promise<any> => {
	try {
		const canonico = await getCanonicoByIdService(id);

		await atualizaStatusDoCanonico(id, CANONICO_STATUS_INATIVO);

		return canonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao deletar o canônico: ${error.message}`, 500);
	}
};

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

		const responses = [];
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

		let dadoCanonico = await processCanonicoData(canonicoExistente, responses, dadosParametros);

		const dynamoDBServiceForCanonicoData: DynamoDBService = new DynamoDBService(canonicoExistente.nome);
		await dynamoDBServiceForCanonicoData.putItem(dadoCanonico);

		return dadoCanonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao carregar o canônico de ID ${id}: ${error.message}`, 500);
	}
};

export async function sincronizaCanonicoService(id: string, kafkaMessage: any): Promise<any> {
	try {
		const canonicoExistente = await getCanonicoByIdService(id);

		await synchronizeCanonical(canonicoExistente, kafkaMessage);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao sincronizar o canônico de ID ${id}: ${error.message}`, 500);
	}
}

export async function reprocessaCanonicoService(id: string, payloadReprocessamento: any) {
	try {
		const canonicoExistente = await getCanonicoByIdService(id);

		await reproccessCanonical(canonicoExistente, payloadReprocessamento);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao reprocessar o canônico de ID ${id}: ${error.message}`, 500);
	}
}
