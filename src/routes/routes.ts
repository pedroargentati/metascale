import express from 'express';
import {
	createCanonico,
	deleteCanonico,
	getAllCanonico,
	getCanonicoById,
	loadCanonico,
	reprocessaCanonico,
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
 * /canonico/{id}/reprocessa:
 *   post:
 *     tags:
 *       - Canonicos
 *     summary: Reprocessar um canônico por ID.
 *     description: Reprocessa um canônico específico usando o ID fornecido e um payload de reprocessamento.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do canônico a ser reprocessado.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payloadReprocessamento:
 *                 type: object
 *                 description: Dados necessários para o reprocessamento do canônico.
 *                 example: {}
 *     responses:
 *       200:
 *         description: Canônico reprocessado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Canônico reprocessado com sucesso."
 *       400:
 *         description: Requisição inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do canônico inválido ou payload de reprocessamento ausente."
 *       404:
 *         description: Requisição inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Canônico não encontrado"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao reprocessar o canônico de ID {id}: {mensagem de erro}"
 */

router.post('/canonico/:id/reprocessa', asyncHandler(reprocessaCanonico));

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
 *       - Canonicos
 *     summary: Criar canônicos.
 *     description: |
 *       Cria um novo canônico. O processo de criação inclui:
 *       - Validação dos dados fornecidos.
 *       - Verificação se o nome do canônico já existe e se está ativo.
 *       - Salvamento do canônico e criação da tabela correspondente no DynamoDB.
 *       Exceções que podem ser lançadas:
 *       - O corpo da requisição não pode estar vazio.
 *       - Os campos nome, descrição, chamadas e tipoPosProcessamento são obrigatórios.
 *       - O campo tipoPosProcessamento deve ter valores válidos.
 *       - O campo chamadas deve ser um array e não pode estar vazio.
 *       - O campo ordem é obrigatório para cada chamada.
 *       - O campo nome é obrigatório para cada chamada.
 *       - O campo url é obrigatório para cada chamada.
 *       - O campo descrição é obrigatório para cada chamada.
 *       - Nomes de chamadas duplicados não são permitidos.
 *       - Canônico com o nome já existe e está inativo.
 *       - Canônico com o nome já existe.
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
 *         description: |
 *           Erro na criação do canônico. Veja a descrição para mais detalhes.
 *       409:
 *         description: |
 *           Conflito ao criar o canônico. Veja a descrição para mais detalhes.
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

/**
 * @swagger
 * /produce:
 *   post:
 *     tags:
 *       - Job
 *     summary: Produzir uma mensagem para um tópico do Kafka.
 *     description: Produz uma mensagem para um tópico do Kafka.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 description: O tópico do Kafka para produzir.
 *                 example: my-topic
 *               message:
 *                 type: object
 *                 description: A mensagem a ser produzida.
 *                 example: { "key": "value" }
 *     responses:
 *       200:
 *         description: Mensagem produzida com sucesso.
 *       500:
 *         description: Erro ao produzir a mensagem.
 */
router.post('/produce', produceMessage);

/**
 * @swagger
 * /consume:
 *   post:
 *     tags:
 *       - Job
 *     summary: Iniciar o consumo de mensagens de um tópico do Kafka.
 *     description: Inicia o consumo de mensagens de um tópico do Kafka.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 description: O tópico do Kafka para consumir.
 *                 example: my-topic
 *     responses:
 *       200:
 *         description: Consumo da mensagem iniciado.
 *       500:
 *         description: Erro ao consumir a mensagem.
 */
router.post('/consume', consumeMessages);

// Middleware para tratamento de erros
router.use(errorHandler);
// Middleware para logar erros
router.use(logError);

export default router;
