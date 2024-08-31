import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID,
	brokers: process.env.KAFKA_BROKERS!?.split(',') || ['localhost:9092'],
	logLevel: logLevel.INFO,
});

export default kafka;
