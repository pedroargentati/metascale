import express from 'express';
import { createCanonico, deleteCanonico, getAllCanonico, getCanonicoById, updateCanonico } from './canonico';
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

/** Criar canônicos. */
router.post('/canonicos', asyncHandler(createCanonico));

/** Atualizar canônicos. */
router.put('/canonicos/:id', asyncHandler(updateCanonico));

/** Deletar canônico */
router.delete('/canonicos/:id', asyncHandler(deleteCanonico));

// Middleware para tratamento de erros
router.use(errorHandler);
router.use(logError);

export default router;
