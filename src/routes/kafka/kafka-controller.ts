import { Request, Response } from 'express';
import KafkaService from '../../service/kafka/kafka-service.js';
import { logger } from '../../config/logger/logger.js';

/**
 * @description Produz uma mensagem para um tópico do Kafka.
 * @param {Request} req - O objeto de solicitação do Express.
 * @param {Response} res - O objeto de resposta do Express.
 */
export const produceMessage = async (req: Request, res: Response) => {
	logger.info('[ROUTES :: Kafka] Iniciando produceMessage.');
	try {
		const { topic, message } = req.body;
		await KafkaService.produce(topic, message);
		res.status(200).send('Mensagem produzida com sucesso.');
	} catch (error) {
		logger.error(`[ROUTES :: Kafka] Erro ao produzir a mensagem: ${error}`);
		res.status(500).send('Erro ao produzir a mensagem.');
	}
};

/**
 * @description Inicia o consumo de mensagens de um tópico do Kafka.
 * @param {Request} req - O objeto de solicitação do Express.
 * @param {Response} res - O objeto de resposta do Express.
 */
export const consumeMessages = (req: Request, res: Response) => {
	logger.info('[ROUTES :: Kafka] Iniciando consumeMessages.');
	try {
		const { topic } = req.body;
		KafkaService.consume(topic, (message: any) => {
			logger.info(`Mensagem recebida: ${JSON.stringify(message)}`);
		});
		res.status(200).send('Consumo da mensagem iniciado.');
	} catch (error) {
		logger.error(`[ROUTES :: Kafka] Erro ao consumir a mensagem: ${error}`);
		res.status(500).send('Erro ao consumir a mensagem.');
	}
};
