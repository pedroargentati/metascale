import kafka from '../../config/kafka/kafka.config';

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
		await this.consumer.connect();
		await this.consumer.subscribe({ topic, fromBeginning: true });

		await this.consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				const receivedMessage = message.value ? JSON.parse(message.value.toString()) : null;
				callback(receivedMessage);
			},
		});
	}
}

export default new KafkaService();
