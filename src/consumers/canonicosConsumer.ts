import logger from '../config/logger/logger.js';
import { sincronizaCanonicoService } from '../service/canonico/etl/index.js';
import { getCanonicoService } from '../service/canonico/index.js';
import kafkaService from '../service/kafka/kafka-service.js';

/**
 * Consome todas as mensagens dos tópicos canônicos.
 */
async function consumeAllCanonicos() {
	logger.info('[APP :: Kafka] Iniciando consumeAllCanonicos...');
	const allCanonicos: Record<string, any>[] = await getCanonicoService();
	console.log('allCanonicos', allCanonicos);
	if (!allCanonicos?.length) {
		logger.info('[APP :: Kafka] Nenhum canônico encontrado para consumir.');
		return;
	}

	try {
		// Consome mensagens de todos os tópicos canônicos
		for (const canonico of allCanonicos) {
			if (!canonico.topicos) {
				logger.error(`[APP :: Kafka] Canônico ${canonico.nome} não possui tópicos. Continuando...`);
				continue;
			}

			for (const topico of canonico.topicos) {
				// Cria um novo consumidor para cada tópico de maneira independente
				const consumer = kafkaService.consume(topico, async (message: any) => {
					const startTime: number = new Date().getTime();
					logger.info(
						`[APP :: Kafka] Iniciando processamento para o canônico ${canonico.nome} no tópico ${topico}.`,
					);

					try {
						await sincronizaCanonicoService(canonico, topico, message);
					} catch (error: any) {
						logger.log(
							'synchronize',
							`Erro ao sincronizar o canônico: ID: ${canonico?.id} | Tópico: ${topico} | Mensagem: ${JSON.stringify(message)} :: ${error.message}`,
						);
					} finally {
						const endTime: number = new Date().getTime();
						const duration: number = endTime - startTime;
						logger.info(
							`[APP :: Kafka] Tempo de processamento para o canônico ${canonico.nome} no tópico ${topico}: ${duration} ms`,
						);
					}
				});

				consumer.catch((error: any) =>
					logger.error(`[APP :: Kafka] Erro ao consumir tópico ${topico}: ${error.message}`),
				);
			}
		}
	} catch (error: any) {
		logger.error(`[APP :: Kafka] Erro ao consumir tópicos canônicos: ${error.message}`);
	} finally {
		logger.info('[APP :: Kafka] Fim do consumeAllCanonicos.');
	}
}

export default consumeAllCanonicos;
