import winston, { createLogger, format } from 'winston';

const { combine, timestamp, printf, errors } = format;

const levels: Record<string, number> = {
	business: 0,
	synchronize: 1,
	load: 2,
	reprocess: 3,
	info: 4,
	warn: 5,
	error: 6,
};

const colors: Record<string, string> = {
	business: 'orange',
	synchronize: 'blue',
	reprocess: 'magenta',
	load: 'cyan',
	info: 'green',
	warn: 'yellow',
	error: 'red',
};

winston.addColors(colors);

// Função que gera o formato customizado para o nível especificado
const createCustomFormat = (label: string) => {
	return printf(({ level, message, timestamp, stack }) => {
		const lb = label ? `[${label}]` : '';
		return `${timestamp} ${lb} ${level}: ${stack || message}`;
	});
};

// Função para aplicar o formato de data e tratamento de erros
const baseFormat = format.combine(timestamp({ format: 'DD/MM/YYYY HH:mm:ss:ssS' }), errors({ stack: true }));

const businessFormat = format.combine(baseFormat, createCustomFormat('BUSINESS'));
const synchronizeFormat = format.combine(baseFormat, createCustomFormat('SYNCHRONIZE'));
const loadFormat = format.combine(baseFormat, createCustomFormat('LOAD'));
const reprocessFormat = format.combine(baseFormat, createCustomFormat('REPROCESS'));
const defaultFormat = format.combine(baseFormat, createCustomFormat(''));

const transports = [
	new winston.transports.Console({
		format: combine(timestamp(), format.colorize(), defaultFormat),
	}),
	new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: defaultFormat }),
	new winston.transports.File({
		filename: 'logs/business.log',
		format: businessFormat,
	}),
	new winston.transports.File({
		filename: 'logs/synchronize.log',
		format: synchronizeFormat,
	}),
	new winston.transports.File({
		filename: 'logs/load.log',
		format: loadFormat,
		level: 'load',
	}),
	new winston.transports.File({
		filename: 'logs/reprocess.log',
		format: reprocessFormat,
	}),
	new winston.transports.File({
		filename: 'logs/combined.log',
		format: defaultFormat,
	}),
];

const logger = createLogger({
	level: 'info',
	levels: levels,
	format: combine(timestamp(), errors({ stack: true }), defaultFormat), // Formato padrão para outros níveis
	transports: transports,
	exitOnError: false,
});

export default logger;
