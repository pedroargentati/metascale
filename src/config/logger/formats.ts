import { format } from 'winston';

const { combine, timestamp, printf, errors } = format;

// Formato básico com timestamp e tratamento de erros
const baseFormat = combine(timestamp({ format: 'DD/MM/YYYY HH:mm:ss:ssS' }), errors({ stack: true }));

// Função que gera o formato customizado para o nível especificado
const createCustomFormat = (label: string) => {
	return printf(({ level, message, timestamp, stack }) => {
		const lb = label ? `[${label}]` : '';
		return `${timestamp} ${lb} ${level}: ${stack || message}`;
	});
};

// Formatos específicos para cada tipo de log
export const createDebugFormat = () => combine(baseFormat, createCustomFormat('DEBUG'));
export const createSyncFormat = () => combine(baseFormat, createCustomFormat('SYNCHRONIZE'));
export const createLoadFormat = () => combine(baseFormat, createCustomFormat('LOAD'));
export const createReprocessFormat = () => combine(baseFormat, createCustomFormat('REPROCESS'));
export const createDefaultFormat = () => combine(baseFormat, createCustomFormat(''));
