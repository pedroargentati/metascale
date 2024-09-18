import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import { createDefaultFormat, createDebugFormat } from './formats.js';
import { IS_DEV } from '../../utils/constants.js';

const awsRegion = process.env.AWS_REGION || 'us-east-2';
const logGroupName = process.env.AWS_LOG_GROUP_NAME || '/ecs/MetascaleAPI';

// Função para criar os transportes de log
export const createTransports = (streamName?: string) => {
	let transports = [];

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
			new winston.transports.File({
				filename: `logs/${streamName}.log`,
				level: 'debug',
				format: createDebugFormat(),
			}),
			new winston.transports.File({
				filename: `logs/${streamName}-error.log`,
				level: 'error',
				format: createDefaultFormat(),
			}),
		);
	} else {
		transports = [
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: `${streamName}.log`,
				level: 'info',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName,
				logStreamName: `${streamName}-error.log`,
				level: 'error',
				awsRegion,
				jsonMessage: true,
			}),
		];
	}

	return transports;
};
