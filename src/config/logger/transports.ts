import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import { createDefaultFormat, createDebugFormat } from './formats.js';
import { IS_DEV } from '../../utils/constants.js';

const awsRegion = process.env.AWS_REGION || 'us-east-2';

// Função para criar os transportes de log
export const createTransports = () => {
	const transports = [];

	if (IS_DEV) {
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
			new winston.transports.File({ filename: 'logs/debug.log', level: 'debug', format: createDebugFormat() }),
			new winston.transports.File({ filename: 'logs/info.log', level: 'info', format: createDefaultFormat() }),
		);
	} else {
		const logGroupName = process.env.AWS_LOG_GROUP_NAME || '/ecs/MetascaleAPI';

		// Modo produção - logs enviados para o AWS CloudWatch
		transports.push(
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
