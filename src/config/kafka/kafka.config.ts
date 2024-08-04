import { Kafka, Partitioners, logLevel } from 'kafkajs';

const kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID,
	brokers: [process.env.KAFKA_BROKER!],
	logLevel: logLevel.INFO,
});

export default kafka;
