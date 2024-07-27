/** Errors */
import { IntegrationError } from '../../errors/IntegrationError';

/** Client Operations */
import { fetchDataController } from '../client/client';
import DynamoDBService from '../../dynamodb/DynamoDBService';

/** Métodos de Validações/Processamento de dados. */
import { processCanonicoData } from './etl/etl-processor';
import { validateCanonico } from './validations/validations';
import { IParametro } from '../../interfaces/parametros';

const CANONICO_COLLECTION: string = 'canonico';

const dynamoDBService: DynamoDBService = new DynamoDBService(CANONICO_COLLECTION);

export const getCanonicoService = async (): Promise<any> => {
	try {
		const canonicos = await dynamoDBService.getAllItems();
		if (!canonicos || !canonicos.length) {
			throw new IntegrationError('Canônicos não encontrados.', 204);
		}
		return canonicos;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao buscar os canônicos no dynamo: ${error.message}`, 500);
	}
};

export const getCanonicoByIdService = async (id: string): Promise<any> => {
	try {
		const canonico = await dynamoDBService.getItem({ nome: id });
		if (!canonico) {
			throw new IntegrationError('Canônico não encontrado', 404);
		}
		return canonico;
	} catch (error: any) {
		throw error;
	}
};

export const createCanonicoService = async (data: any): Promise<any> => {
	try {
		validateCanonico(data);

		data.chamadas.sort((a: any, b: any) => a.ordem - b.ordem);

		await dynamoDBService.addItem(data).then(() => new DynamoDBService(data.nome).createTable());

		return data;
	} catch (error: any) {
		throw error;
	}
};

const getCanonicoExistente = async (id: string): Promise<any> => {
	const canonicoExistente = await dynamoDBService.getItem({ nome: id });
	if (!canonicoExistente) {
		throw new IntegrationError('Canônico não encontrado', 404);
	}
	return canonicoExistente;
};

export const updatePartialCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const canonicoExistente = await getCanonicoExistente(id);

		if (!canonicoExistente) {
			throw new IntegrationError('Canônico não encontrado', 404);
		}

		if (data.status_canonico === canonicoExistente.status_canonico) return;

		const updateExpression: string = 'SET status_canonico = :status_canonico';
		const expressionAttributeValues: any = { ':status_canonico': data.status_canonico };

		await dynamoDBService.updateItem({ nome: id }, updateExpression, expressionAttributeValues);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};

export const updateCanonicoService = async (id: string, data: any): Promise<any> => {
	try {
		const canonicoExistente = await getCanonicoExistente(id);

		if (!canonicoExistente) {
			throw new IntegrationError('Canônico não encontrado', 404);
		}

		validateCanonico(data);

		// await dynamoDBService.updateItem({ nome: id }, data);

		// TODO: Agendar reprocessamento de canonicos já inseridos na estrutura anterior
		// return await getOne(CANONICO_COLLECTION, id);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao atualizar o canônico: ${error.message}`, 500);
	}
};

export const deleteCanonicoService = async (id: string): Promise<any> => {
	try {
		const canonico = await getCanonicoExistente(id);

		if (!canonico) {
			throw new IntegrationError('Canônico não encontrado', 404);
		}

		await dynamoDBService.deleteItem({ nome: id });
		return canonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao deletar o canônico: ${error.message}`, 500);
	}
};

export const loadCanonicoService = async (id: string, dadosParametros: any): Promise<any> => {
	try {
		const canonicoExistente = await getCanonicoExistente(id);

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
					(chamada: { url: string; parametros: IParametro[] }) =>
						fetchDataController(chamada.url, chamada.parametros, dadosParametros),
				);

				const resolvedResponses = await Promise.all(requisicoesDisparadas).catch((error) => {
					throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
				});

				responses.push(...resolvedResponses);
			} catch (error: any) {
				throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
			}
		}

		// Processamento e montagem do canônico usando os metadados
		const dadoCanonico = processCanonicoData(chamadas, responses, dadosParametros);

		const dynamoDBServiceForCanonicoData: DynamoDBService = new DynamoDBService(canonicoExistente.nome);
		await dynamoDBServiceForCanonicoData.addItem(dadoCanonico);

		return dadoCanonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro ao carregar o canônico de ID ${id}: ${error.message}`, 500);
	}
};
