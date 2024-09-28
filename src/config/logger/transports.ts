import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import { createDefaultFormat, createDebugFormat } from './formats.js';
import { IS_DEV } from '../../utils/constants.js';

const awsRegion = process.env.AWS_REGION;
const logGroupName = process.env.AWS_LOG_GROUP_NAME || '/app/Metascale';

// Função para criar os transportes de log
export const createTransports = (logName?: string) => {
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
				level: 'debug',
			}),
			new winston.transports.File({
				filename: `logs/${logName}.log`,
				level: 'info',
				format: createDefaultFormat(),
			}),
			new winston.transports.File({
				filename: `logs/${logName}-error.log`,
				level: 'error',
				format: createDefaultFormat(),
			}),
		);
	} else {
		transports = [
			new WinstonCloudWatch({
				logGroupName: `${logGroupName}/${logName}.log`,
				logStreamName: `${logName}.log`,
				level: 'info',
				awsRegion,
				jsonMessage: true,
			}),
			new WinstonCloudWatch({
				logGroupName: `${logGroupName}/${logName}-error.log`,
				logStreamName: `${logName}-error.log`,
				level: 'error',
				awsRegion,
				jsonMessage: true,
			}),
		];
	}

	return transports;
};

export const createCanonicalTransports = () => {
	let transports = [];

	if (IS_DEV) {
		transports.push(
			new winston.transports.File({
				filename: `logs/canonical.log`,
				level: 'info',
				format: createDefaultFormat(),
			}),
		);
	} else {
		transports = [
			new WinstonCloudWatch({
				logGroupName: `${logGroupName}/canonical.log`,
				logStreamName: `canonical.log`,
				level: 'info',
				awsRegion,
				jsonMessage: true,
			}),
		];
	}

	return transports;
};
