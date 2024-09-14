import 'dotenv/config';
import { setupSwagger } from '../swagger.config.js';
import express from 'express';
import * as core from 'express-serve-static-core';
import routes from './routes/routes.js';
import consumeAllCanonicos from './consumers/canonicosConsumer.js';
import { INSTANCE_TYPE_API } from './utils/constants.js';
import { logger } from './config/logger/logger.js';

let app: core.Express | null = null;

// Função para inicializar o servidor Express
function initializeServer() {
	app = express();
	app.use(express.json());

	const port = process.env.PORT || 8080;
	app.use('/', routes);
	setupSwagger(app);

	app.listen(port, () => {
		logger.info(`Servidor está escutando: http://localhost:${port}`);
	});
}

// Função para inicializar o consumidor Kafka
async function initializeKafkaConsumer() {
	try {
		await consumeAllCanonicos();
	} catch (error) {
		logger.error('Erro ao iniciar o consumidor Kafka:', error);
	}
}

// Validação da variável de ambiente INSTANCE_TYPE
if (!process.env.INSTANCE_TYPE) {
	throw new Error('A variável de ambiente INSTANCE_TYPE não está definida.');
}

// Inicialização baseada no tipo de instância
if (process.env.INSTANCE_TYPE === INSTANCE_TYPE_API) {
	initializeServer();
} else {
	initializeKafkaConsumer();
}
logger.info(`Inicialização baseada no tipo de instância: ${process.env.INSTANCE_TYPE}`);

export default app;
