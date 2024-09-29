import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import { LOG_TYPE_FILE } from '../../utils/constants.js';
import { createDebugFormat } from './formats.js';

const awsRegion = process.env.AWS_REGION;
const logGroupName = process.env.AWS_LOG_GROUP_NAME || '/app/Metascale';
const logType = process.env.LOG_TYPE || 'FILE';

// Função para criar os transportes de log
export const createTransports = (logName?: string) => {
	let transports = [];

	if (logType === LOG_TYPE_FILE) {
		transports.push(
			new winston.transports.Console({
				format: winston.format.combine(winston.format.colorize(), createDebugFormat()),
				level: 'debug',
			}),
			new winston.transports.File({
				filename: `logs/${logName}.log`,
				level: 'info',
			}),
			new winston.transports.File({
				filename: `logs/${logName}-error.log`,
				level: 'error',
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

	if (logType === LOG_TYPE_FILE) {
		transports.push(
			new winston.transports.File({
				filename: `logs/canonical.log`,
				level: 'info',
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
