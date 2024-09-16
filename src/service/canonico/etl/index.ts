import { reprocessCanonical, synchronizeCanonical } from '@internal/canonical-builder';
import { logger } from '../../../config/logger/logger.js';
import DynamoDBService from '../../../dynamodb/DynamoDBService.js';
import { IntegrationError } from '../../../errors/IntegrationError.js';
import { IParametro } from '../../../interfaces/parametros.js';
import { fetchDataController } from '../../client/client.js';
import { getCanonicoByIdService } from '../index.js';
import { processCanonicoDataService } from './etl-processor.js';

/**
 * @description Carrega o dado do canônico.
 *
 * @param {string} id - ID do canônico.
 * @param {any} dadosParametros - Dados dos parâmetros.
 * @returns Dado canônico.
 */
export const loadCanonicoService = async (id: string, dadosParametros: any): Promise<any> => {
	return await loadCanonico(await getCanonicoByIdService(id), dadosParametros);
};

/**
 * @description Carrega o dado do canônico.
 *
 * @param {string} canonico - Canônico sendo carregado.
 * @param {any} dadosParametros - Dados dos parâmetros.
 * @returns Dado canônico.
 */
const loadCanonico = async (canonico: any, dadosParametros: any): Promise<any> => {
	try {
		const { chamadas } = canonico;

		const chamadasPorOrdem = new Map();
		for (const chamada of chamadas) {
			if (!chamadasPorOrdem.has(chamada.ordem)) {
				chamadasPorOrdem.set(chamada.ordem, [chamada]);
			} else {
				chamadasPorOrdem.get(chamada.ordem).push(chamada);
			}
		}

		logger.info(
			`[SERVICE :: Canonico] Iniciando carregamento com os seguintes dados: ${JSON.stringify(dadosParametros)}`,
		);

		const requestCalls: Map<string, any> = new Map();
		for (const ordem of chamadasPorOrdem.keys()) {
			try {
				const chamadasDaOrdem = chamadasPorOrdem.get(ordem);

				const requisicoesDisparadas = chamadasDaOrdem.map(
					(chamada: { url: string; parametros: IParametro[]; nome: string }) =>
						fetchDataController(chamada.url, chamada.parametros, dadosParametros[chamada.nome]),
				);

				const resolvedResponses = await Promise.all(requisicoesDisparadas).catch((error) => {
					throw new IntegrationError(
						`Ocorreu um erro em alguma das requisições envolvidas no load: ${error.message}`,
						500,
					);
				});

				for (const [index, chamada] of chamadasDaOrdem.entries()) {
					const response = resolvedResponses[index];

					requestCalls.set(chamada.nome, response);
				}
			} catch (error: any) {
				throw new IntegrationError(`Erro ao buscar os dados da chamada: ${error.message}`, 500);
			}
		}

		let dadoCanonico = await processCanonicoDataService(canonico, requestCalls, dadosParametros);

		const dynamoDBServiceForCanonicoData: DynamoDBService = new DynamoDBService(canonico.nome);
		await dynamoDBServiceForCanonicoData.putItem(dadoCanonico);

		return dadoCanonico;
	} catch (error: any) {
		throw new IntegrationError(`Erro no load do canônico ${canonico.nome}: ${error.message}`, 500);
	}
};

/**
 * @description Sincroniza o canônico.
 *
 * @param canonico Canônico a ser sincronizado.
 * @param kafkaMessage Mensagem a ser consumida no kafka.
 */
export async function sincronizaCanonicoService(canonico: any, topico: string, kafkaMessage: any): Promise<any> {
	logger.debug(`[SERVICE :: Canonico] Iniciando sincronização do canônico ${canonico.nome} do tópico ${topico}...`);
	try {
		await synchronizeCanonical(
			canonico,
			topico,
			kafkaMessage,
			async (dadosParametro) => await loadCanonico(canonico, dadosParametro),
		);
	} catch (error: any) {
		throw new IntegrationError(`Erro ao sincronizar o canônico de ID ${canonico?.id}: ${error.message}`, 500);
	} finally {
		logger.debug(`[SERVICE :: Canonico] Fim da sincronização do canônico ${canonico.nome} do tópico ${topico}.`);
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

		await reprocessCanonical(canonicoExistente, payloadReprocessamento, async (dadosParametro) => {
			return await loadCanonico(canonicoExistente, dadosParametro);
		});
	} catch (error: any) {
		throw new IntegrationError(`Erro ao reprocessar o canônico de ID ${id}: ${error.message}`, 500);
	}
}
