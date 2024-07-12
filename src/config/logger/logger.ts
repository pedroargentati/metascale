import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
	level: 'info',
	format: combine(timestamp(), errors({ stack: true }), myFormat),
	transports: [new transports.Console(), new transports.File({ filename: 'combined.log' })],
});

export default logger;
