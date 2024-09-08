import { reprocessCanonical, synchronizeCanonical } from '@internal/canonical-builder';
import logger from '../../../config/logger/logger.js';
import DynamoDBService from '../../../dynamodb/DynamoDBService.js';
import { IntegrationError } from '../../../errors/IntegrationError.js';
import { IParametro } from '../../../interfaces/parametros.js';
import { fetchDataController } from '../../client/client.js';
import { getCanonicoByIdService } from '../index.js';
import { processCanonicoDataService } from './etl-processor.js';

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

		const requestCalls: Map<string, any> = new Map();
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

				for (const [index, chamada] of chamadasDaOrdem.entries()) {
					const response = resolvedResponses[index];

					requestCalls.set(chamada.nome, response);
				}
			} catch (error: any) {
				throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
			}
		}

		let dadoCanonico = await processCanonicoDataService(canonicoExistente, requestCalls, dadosParametros);

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

		await reprocessCanonical(canonicoExistente, payloadReprocessamento);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao reprocessar o canônico de ID ${id}: ${error.message}`, 500);
	}
}
