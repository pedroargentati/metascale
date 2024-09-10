import kafka from '../config/kafka/kafka.config.js';
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
		// Cria um único consumidor Kafka para todos os tópicos
		const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'metascale-group' });
		await consumer.connect();

		// Subscrição para todos os tópicos canônicos
		for (const canonico of allCanonicos) {
			if (!canonico.topicos) {
				logger.error(`[APP :: Kafka] Canônico ${canonico.nome} não possui tópicos. Continuando...`);
				continue;
			}

			for (const topico of canonico.topicos) {
				await consumer.subscribe({ topic: topico, fromBeginning: true });
				logger.info(`[APP :: Kafka] Subscrito no tópico ${topico} para o canônico ${canonico.nome}`);
			}
		}

		// Processamento das mensagens dos tópicos
		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				try {
					const receivedMessage = message.value ? JSON.parse(message.value.toString()) : null;
					const canonico = allCanonicos.find((c) => c.topicos.includes(topic));

					if (canonico) {
						const startTime: number = new Date().getTime();
						logger.info(
							`[APP :: Kafka] Iniciando processamento para o canônico ${canonico.nome} no tópico ${topic}.`,
						);

						try {
							await sincronizaCanonicoService(canonico, topic, receivedMessage);
						} catch (error: any) {
							logger.log(
								'synchronize',
								`Erro ao sincronizar o canônico: ID: ${canonico?.id} | Tópico: ${topic} | Mensagem: ${JSON.stringify(receivedMessage)} :: ${error.message}`,
							);
						} finally {
							const endTime: number = new Date().getTime();
							const duration: number = endTime - startTime;
							logger.info(
								`[APP :: Kafka] Tempo de processamento para o canônico ${canonico.nome} no tópico ${topic}: ${duration} ms`,
							);
						}
					}
				} catch (error: any) {
					logger.error(`[KAFKA :: Erro ao consumir mensagem do tópico ${topic}: ${error.message}`);
				}
			},
		});
	} catch (error: any) {
		logger.error(`[APP :: Kafka] Erro ao consumir tópicos canônicos: ${error.message}`);
	} finally {
		logger.info('[APP :: Kafka] Fim do consumeAllCanonicos.');
	}
}

export default consumeAllCanonicos;
