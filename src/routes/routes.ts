import express from 'express';
import {
	createCanonico,
	deleteCanonico,
	getAllCanonico,
	getCanonicoById,
	loadCanonico,
	updateCanonico,
	updatePartialCanonico,
} from './canonico';
import { logRequest, logError } from '../middlewares/loggerMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { errorHandler } from '../middlewares/globalExptionHandler';

const router = express.Router();

// Middleware para logar cada requisição
router.use(logRequest);

/**
 * @swagger
 * /:
 *   get:
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
 * /canonicos:
 *   get:
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
router.get('/canonicos', asyncHandler(getAllCanonico));

/**
 * @swagger
 * /canonicos/{id}:
 *   get:
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
router.get('/canonicos/:id', asyncHandler(getCanonicoById));

/**
 * @swagger
 * /canonicos/{nome}/load:
 *   post:
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
router.post('/canonicos/:nome/load', asyncHandler(loadCanonico));

/**
 * @swagger
 * /canonicos:
 *   post:
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
router.post('/canonicos', asyncHandler(createCanonico));

/**
 * @swagger
 * /canonicos/{id}:
 *   put:
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
router.put('/canonicos/:id', asyncHandler(updateCanonico));

/**
 * @swagger
 * /canonicos/{id}:
 *   patch:
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
router.patch('/canonicos/:id', asyncHandler(updatePartialCanonico));

/**
 * @swagger
 * /canonicos/{id}:
 *   delete:
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
router.delete('/canonicos/:id', asyncHandler(deleteCanonico));

// Middleware para tratamento de erros
router.use(errorHandler);
// Middleware para logar erros
router.use(logError);

export default router;
