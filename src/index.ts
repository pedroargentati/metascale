import express from 'express';
import * as core from 'express-serve-static-core';
import routes from './routes/routes';

const app: core.Express = express();
const defaultProt: number = 8080;

app.use('/', routes);

app.listen(defaultProt, () => {
	console.log(`Servidor está escutando: http://localhost:${defaultProt}`);
});

export default app;
