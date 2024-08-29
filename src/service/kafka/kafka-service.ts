import kafka from '../../config/kafka/kafka.config';
import logger from '../../config/logger/logger';

/**
 * @description Classe KafkaService para produzir e consumir mensagens do Kafka.
 */
class KafkaService {
	private producer = kafka.producer();
	private consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || '' });

	/**
	 * Produz uma mensagem para um tópico do Kafka.
	 * @param {string} topic - O tópico do Kafka para produzir.
	 * @param {any} message - A mensagem a ser produzida.
	 */
	async produce(topic: string, message: any) {
		await this.producer.connect();
		await this.producer.send({
			topic,
			messages: [{ value: JSON.stringify(message) }],
		});
		await this.producer.disconnect();
	}

	/**
	 * Consome mensagens de um tópico do Kafka.
	 * @param {string} topic - O tópico do Kafka para consumir.
	 * @param {function} callback - A função de callback para processar cada mensagem.
	 */
	async consume(topic: string, callback: (message: any) => void) {
		logger.info(`[KAFKA :: Consumidor] Consumindo tópico ${topic}...`);
		try {
			await this.consumer.connect();
			await this.consumer.subscribe({ topic, fromBeginning: true });

			await this.consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					try {
						const receivedMessage = message.value ? JSON.parse(message.value.toString()) : null;
						callback(receivedMessage);
					} catch (error: any) {
						console.error(`[KAFKA :: Erro ao consumir mensagem do tópico ${topic}: ${error.message}`);
					}
				},
			});
		} catch (error: any) {
			console.error(`[KAFKA :: Erro ao conectar no Kafka ou se inscrever no tópico ${topic}: ${error.message}`);
		}
	}

	/**
	 * Desconecta o consumidor do Kafka.
	 */
	public async disconnectConsumer() {
		try {
			await this.consumer.disconnect();
			logger.info('[KAFKA :: Consumidor desconectado com sucesso.');
		} catch (error: any) {
			logger.error(`[KAFKA :: Erro ao desconectar o consumidor do Kafka: ${error.message}`);
		}
	}
}

export default new KafkaService();
