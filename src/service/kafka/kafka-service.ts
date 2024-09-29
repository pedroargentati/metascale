import kafka from '../../config/kafka/kafka.config.js';
import { logger } from '../../config/logger/logger.js';

/**
 * @description Classe KafkaService para produzir e consumir mensagens do Kafka.
 */
class KafkaService {
	/**
	 * Produz uma mensagem para um tópico do Kafka.
	 * @param {string} topic - O tópico do Kafka para produzir.
	 * @param {any} message - A mensagem a ser produzida.
	 */
	async produce(topic: string, message: any) {
		const producer = kafka.producer();
		await producer.connect();
		await producer.send({
			topic,
			messages: [{ value: JSON.stringify(message) }],
		});
		await producer.disconnect();
	}

	/**
	 * Consome mensagens de um tópico do Kafka.
	 * @param {string} topic - O tópico do Kafka para consumir.
	 * @param {function} callback - A função de callback para processar cada mensagem.
	 */
	async consume(topic: string, callback: (message: any) => void) {
		logger.debug(`[KAFKA :: Consumidor] Consumindo tópico ${topic}...`);
		try {
			const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'metascale-group' });
			await consumer.connect();
			await consumer.subscribe({ topic, fromBeginning: true });

			consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					try {
						const receivedMessage = message.value ? JSON.parse(message.value.toString()) : null;
						callback(receivedMessage);
					} catch (error: any) {
						logger.error(`[KAFKA :: Erro ao consumir mensagem do tópico ${topic}: ${error.message}`);
					}
				},
			});
		} catch (error: any) {
			logger.error(`[KAFKA :: Erro ao conectar no Kafka ou se inscrever no tópico ${topic}: ${error.message}`);
		}
	}
}

export default new KafkaService();
