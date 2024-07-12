import { config } from 'dotenv';
config(); // Carrega variáveis de ambiente do .env no início

import express from 'express';
import * as core from 'express-serve-static-core';
import routes from './routes/routes';

const app: core.Express = express();
app.use(express.json());

const defaultPort: number = 8080;

app.use('/', routes);

const port = process.env.PORT || defaultPort;

app.listen(port, () => {
	console.log(`Servidor está escutando: http://localhost:${port}`);
});

export default app;
