import express from 'express';
import {
	createCanonico,
	deleteCanonico,
	getAllCanonico,
	getCanonicoById,
	loadCanonico,
	updateCanonico,
	updatePartialCanonico,
} from './canonico/canonico';
import { logRequest, logError } from '../middlewares/loggerMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { errorHandler } from '../middlewares/globalExptionHandler';
import { produceMessage, consumeMessages } from './kafka/kafka-controller';

const router = express.Router();

// Middleware para logar cada requisição
router.use(logRequest);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *         - Canonicos
 *     summary: Exibe uma mensagem de boas-vindas.
 *     description: Endpoint que exibe uma mensagem de boas-vindas ao acessar a API.
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Bem-vindo à API!
 */
router.get('/', (req, res) => {
	res.send('Bem-vindo à API!');
});

/**
 * @swagger
 * /canonico:
 *   get:
 *     tags:
 *         - Canonicos
 *     summary: Listar todos canônicos.
 *     description: Retorna uma lista com todos os canônicos disponíveis.
 *     responses:
 *       200:
 *         description: Lista de canônicos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Canonico'
 */
router.get('/canonico', asyncHandler(getAllCanonico));

/**
 * @swagger
 * /canonico/{id}:
 *   get:
 *     tags:
 *         - Canonicos
 *     summary: Listar canônico por ID.
 *     description: Retorna um canônico específico com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do canônico a ser retornado.
 *     responses:
 *       200:
 *         description: Dados do canônico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Canonico'
 *       404:
 *         description: Canônico não encontrado.
 */
router.get('/canonico/:id', asyncHandler(getCanonicoById));

/**
 * @swagger
 * /canonico/{nome}/load:
 *   post:
 *     tags:
 *         - Canonicos
 *     summary: Carregar dados de canônicos.
 *     description: Carrega dados para um canônico específico identificado pelo nome.
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do canônico a ser carregado.
 *     responses:
 *       200:
 *         description: Dados carregados com sucesso.
 *       400:
 *         description: Erro ao carregar dados.
 */
router.post('/canonico/:id/load', asyncHandler(loadCanonico));

/**
 * @swagger
 * /canonico:
 *   post:
 *     tags:
 *         - Canonicos
 *     summary: Criar canônicos.
 *     description: Cria um novo canônico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Canonico'
 *     responses:
 *       201:
 *         description: Canônico criado com sucesso.
 *       400:
 *         description: Erro na criação do canônico.
 */
router.post('/canonico', asyncHandler(createCanonico));

/**
 * @swagger
 * /canonico/{id}:
 *   put:
 *     tags:
 *         - Canonicos
 *     summary: Atualizar canônicos.
 *     description: Atualiza um canônico existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do canônico a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Canonico'
 *     responses:
 *       200:
 *         description: Canônico atualizado com sucesso.
 *       400:
 *         description: Erro na atualização do canônico.
 *       404:
 *         description: Canônico não encontrado.
 */
router.put('/canonico/:id', asyncHandler(updateCanonico));

/**
 * @swagger
 * /canonico/{id}:
 *   patch:
 *     tags:
 *         - Canonicos
 *     summary: Atualizar parcialmente canônicos.
 *     description: Atualiza parcialmente um canônico existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do canônico a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Canonico'
 *     responses:
 *       200:
 *         description: Canônico atualizado parcialmente com sucesso.
 *       400:
 *         description: Erro na atualização parcial do canônico.
 *       404:
 *         description: Canônico não encontrado.
 */
router.patch('/canonico/:id', asyncHandler(updatePartialCanonico));

/**
 * @swagger
 * /canonico/{id}:
 *   delete:
 *     tags:
 *         - Canonicos
 *     summary: Deletar canônico.
 *     description: Deleta um canônico específico com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do canônico a ser deletado.
 *     responses:
 *       200:
 *         description: Canônico deletado com sucesso.
 *       404:
 *         description: Canônico não encontrado.
 */
router.delete('/canonico/:id', asyncHandler(deleteCanonico));

router.post('/produce', produceMessage);
router.post('/consume', consumeMessages);

// Middleware para tratamento de erros
router.use(errorHandler);
// Middleware para logar erros
router.use(logError);

export default router;
