import winston, { createLogger } from 'winston';

import dotenv from 'dotenv';
import { createDefaultFormat, createLoadFormat, createReprocessFormat, createSyncFormat } from './formats.js';
import { createTransports } from './transports.js';

// Carregar variáveis de ambiente
dotenv.config();

// Aplicar cores para cada nível
winston.addColors({
	info: 'green',
	warn: 'yellow',
	error: 'red',
});

// Criar o logger com os transportes e formatação padrão
export const logger = createLogger({
	format: createDefaultFormat(),
	transports: createTransports(),
	exitOnError: false,
});

export const loggerReprocess = createLogger({
	format: createReprocessFormat(),
	transports: [new winston.transports.File({ filename: 'logs/reprocess.log' })],
	exitOnError: false,
});

export const loggerSyncronize = createLogger({
	format: createSyncFormat(),
	transports: [new winston.transports.File({ filename: 'logs/syncronize.log' })],
	exitOnError: false,
});

export const loggerLoad = createLogger({
	format: createLoadFormat(),
	transports: [new winston.transports.File({ filename: 'logs/load.log' })],
	exitOnError: false,
});
