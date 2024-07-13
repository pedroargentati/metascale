import express from 'express';
import { getAllCanonico, getCanonicoById, updateCanonico } from './canonico';
import { logRequest, logError } from '../middlewares/loggerMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { errorHandler } from '../middlewares/globalExptionHandler';

const router = express.Router();

// Middleware para logar cada requisição
router.use(logRequest);

router.get('/', (req, res) => {
	res.send('Bem-vindo à API!');
});

/** Listar todos canônicos. */
router.get('/canonicos', asyncHandler(getAllCanonico));

/** Listar canônicos por ID. */
router.get('/canonicos/:id', asyncHandler(getCanonicoById));

/** Atualizar canônicos. */
router.put('/canonicos/:id', asyncHandler(updateCanonico));

// Middleware para tratamento de erros
router.use(errorHandler);
router.use(logError);

export default router;
