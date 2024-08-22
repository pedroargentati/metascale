import { config } from 'dotenv';
import { setupSwagger } from '../swagger.config';
config(); // Carrega variáveis de ambiente do .env no início

import express from 'express';
import * as core from 'express-serve-static-core';
import routes from './routes/routes';
import consumeAllCanonicos from './app/kafka.app';
import { INSTANCE_TYPE_API } from './utils/constants';

let app: core.Express | null = null;

if (process.env.INSTANCE_TYPE === INSTANCE_TYPE_API) {
	app = express();
	app.use(express.json());

	const port = process.env.PORT || 8080;

	app.use('/', routes);
	setupSwagger(app);

	app.listen(port, () => {
		console.log(`Servidor está escutando: http://localhost:${port}`);
	});
} else {
	(async () => {
		await consumeAllCanonicos();
	})();
}

export default app;
