import express from 'express';
import { getAllCanonico, getCanonicoById, updateCanonico } from './canonico';
import { logRequest, logError } from '../middlewares/loggerMiddleware';

const router = express.Router();

// Middleware para logar cada requisição
router.use(logRequest);

router.get('/', (req, res) => {
	res.send('Bem-vindo à API!');
});

/** Listar todos canônicos. */
router.get('/canonicos', getAllCanonico);

/** Listar canônicos por ID. */
router.get('/canonicos/:id', getCanonicoById);

/** Atualizar canônicos. */
router.put('/canonicos/:id', updateCanonico);

// Middleware para tratamento de erros
router.use(logError);

export default router;
