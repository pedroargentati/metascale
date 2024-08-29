import logger from '../config/logger/logger';
import { getCanonicoService, sincronizaCanonicoService } from '../service/canonico';
import kafkaService from '../service/kafka/kafka-service';

/**
 * Consome todas as mensagens dos tópicos canônicos.
 */
async function consumeAllCanonicos() {
	logger.info('[APP :: Kafka] Iniciando consumeAllCanonicos...');
	const allCanonicos: Record<string, any>[] = await getCanonicoService();
	console.log('allCanonicos', allCanonicos);
	if (!allCanonicos?.length) return;

	try {
		// Consome mensagens de todos os tópicos canônicos
		for (const canonico of allCanonicos) {
			if (!canonico.topicos) {
				logger.error(`[APP :: Kafka] Canônico ${canonico.nome} não possui tópicos. Continuando...`);
				continue;
			}

			for (const topico of canonico.topicos) {
				await kafkaService.consume(topico, async (message: any) => {
					await sincronizaCanonicoService(canonico, message);
				});
			}
		}
	} catch (error: any) {
		logger.error(`[APP :: Kafka] Erro ao consumir tópicos canônicos: ${error.message}`);
	} finally {
		logger.info('[APP :: Kafka] Fim do consumeAllCanonicos.');
	}
}

export default consumeAllCanonicos;
