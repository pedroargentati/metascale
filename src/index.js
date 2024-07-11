import express from 'express';
import routes from './routes/routes.js';

const app = express();
const defaultProt = 8080;

app.use('/', routes);

app.listen(defaultProt, () => {
  console.log(`Servidor está escutando: http://localhost:${defaultProt}`);
});

export default app;