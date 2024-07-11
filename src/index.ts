import express from 'express';
import * as core from 'express-serve-static-core';
import routes from './routes/routes';
import connectDB from './config/db';

const app: core.Express = express();
app.use(express.json());

const defaultProt: number = 8080;

app.use('/', routes);

app.listen(process.env.PORT || defaultProt, () => {
	connectDB();

	console.log(`Servidor está escutando: http://localhost:${defaultProt}`);
});

export default app;
