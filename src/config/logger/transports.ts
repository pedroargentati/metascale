import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import {
	createBusinessFormat,
	createSyncFormat,
	createLoadFormat,
	createReprocessFormat,
	createDefaultFormat,
} from './formats.js';

const isDevMode = process.env.DEV_MODE === 'true' || true;
const awsRegion = process.env.AWS_REGION || 'us-east-2';

// Função para criar os transportes de log
export const createTransports = () => {
	const transports = [];

	if (isDevMode) {
		// Modo desenvolvimento - logs em arquivos e console
		transports.push(
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.colorize(),
					createDefaultFormat(),
				),
			}),
			new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: createDefaultFormat() }),
			new winston.transports.File({ filename: 'logs/business.log', format: createBusinessFormat() }),
			new winston.transports.File({ filename: 'logs/synchronize.log', format: createSyncFormat() }),
			new winston.transports.File({ filename: 'logs/load.log', level: 'load', format: createLoadFormat() }),
			new winston.transports.File({ filename: 'logs/reprocess.log', format: createReprocessFormat() }),
			new winston.transports.File({ filename: 'logs/combined.log', format: createDefaultFormat() }),
		);
	} else {
		const logGroupName = process.env.AWS_LOG_GROUP_NAME || '/ecs/MetascaleAPI';

		// Modo produção - logs enviados para o AWS CloudWatch
		transports.push(
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: 'business-logs',
				level: 'business',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: 'synchronize-logs',
				level: 'synchronize',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: 'load-logs',
				level: 'load',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: 'reprocess-logs',
				level: 'reprocess',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: 'default-logs',
				level: 'info',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: 'error-logs',
				level: 'error',
				awsRegion,
				jsonMessage: true,
			}),
		);
	}

	return transports;
};
