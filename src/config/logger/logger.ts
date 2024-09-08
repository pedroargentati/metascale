import winston, { createLogger } from 'winston';

import dotenv from 'dotenv';
import { createDefaultFormat } from './formats.js';
import { createTransports } from './transports.js';

// Carregar variáveis de ambiente
dotenv.config();

// Definir níveis de log
const levels: Record<string, number> = {
	business: 0,
	synchronize: 1,
	load: 2,
	reprocess: 3,
	info: 4,
	warn: 5,
	error: 6,
};

// Aplicar cores para cada nível
winston.addColors({
	business: 'orange',
	synchronize: 'blue',
	reprocess: 'magenta',
	load: 'cyan',
	info: 'green',
	warn: 'yellow',
	error: 'red',
});

// Criar o logger com os transportes e formatação padrão
const logger = createLogger({
	level: 'info',
	levels: levels,
	format: createDefaultFormat(),
	transports: createTransports(),
	exitOnError: false,
});

export default logger;
