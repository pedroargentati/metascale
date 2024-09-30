import kafka from '../config/kafka/kafka.config.js';
import { logger, loggerSyncronize } from '../config/logger/logger.js';
import { sincronizaCanonicosViaKafka } from '../service/canonico/etl/index.js';
import { getCanonicoService } from '../service/canonico/index.js';

// Cria um único consumidor Kafka para todos os tópicos
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'metascale-group' });

/**
 * Consome todas as mensagens dos tópicos canônicos.
 */
async function consumeAllCanonicos() {
	logger.info('[APP :: Kafka] Iniciando consumeAllCanonicos...');
	const allCanonicos: Record<string, any>[] = await getCanonicoService();

	if (!allCanonicos?.length) {
		logger.info('[APP :: Kafka] Nenhum canônico encontrado para consumir.');
		return;
	}

	const todosTopicos = [];
	for (const canonico of allCanonicos) {
		if (!canonico.topicos) {
			logger.info(`[APP :: Kafka] Canônico ${canonico.nome} não possui tópicos. Continuando...`);
			continue;
		}

		todosTopicos.push(...canonico.topicos);
	}
	const todosTopicosUnicos = [...new Set(todosTopicos)];

	await consumer.connect();

	try {
		// Subscrição para todos os tópicos canônicos
		await consumer.subscribe({ topics: todosTopicosUnicos });
		logger.info(`[APP :: Kafka] Subscrito nos tópicos ${todosTopicos}`);

		// Processamento das mensagens dos tópicos
		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				try {
					const receivedMessage = message.value ? JSON.parse(message.value.toString()) : null;
					const canonicos = allCanonicos.filter((c) => c.topicos.includes(topic));

					await sincronizaCanonicosViaKafka(canonicos, topic, receivedMessage);
				} catch (error: any) {
					loggerSyncronize.error(`[KAFKA :: Erro ao consumir mensagem do tópico ${topic}: ${error.message}`);
					logger.error(`[APP :: Kafka] Erro ao consumir mensagem do tópico ${topic}: ${error.message}`);
				}
			},
		});
	} catch (error: any) {
		logger.error(`[APP :: Kafka] Erro ao consumir tópicos canônicos: ${error.message}`);
		throw error;
	}
}

const errorTypes = ['uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach((type) => {
	process.on(type, async (e) => {
		try {
			logger.error(`[APP :: Kafka] Erro inesperado: ${type} - ${e.message}`);
			await consumer.disconnect();
			process.exit(0);
		} catch (_) {
			process.exit(1);
		}
	});
});

signalTraps.forEach((type) => {
	process.once(type, async () => {
		try {
			logger.info(`[APP :: Kafka] Desconectando consumer`);
			await consumer.disconnect();
		} finally {
			process.kill(process.pid, type);
		}
	});
});

export default consumeAllCanonicos;
