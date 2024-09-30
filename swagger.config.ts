import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		tags: [{ name: 'Canonicos' }, { name: 'Kafka' }, { name: 'Other' }],
		info: {
			title: 'Metascale API',
			version: '1.0.0',
			description: `Documentação da API do Metascale.`,
			contact: {
				name: 'Cicada',
			},
		},
		servers: [
			{
				url: 'http://localhost:8080',
			},
		],
		components: {
			schemas: {
				Canonico: {
					type: 'object',
					properties: {
						statusCanonico: {
							type: 'string',
							description: 'O status do canônico.',
						},
						chamadas: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/Chamada',
							},
							description: 'Lista de chamadas associadas ao canônico.',
						},
						dependencias: {
							type: 'array',
							items: {
								type: 'string',
							},
							description: 'Lista de dependências do canônico (opcional).',
						},
						descricao: {
							type: 'string',
							description: 'Descrição do canônico.',
						},
						versao: {
							type: 'integer',
							format: 'int32',
							description: 'Versão do canônico.',
						},
						nome: {
							type: 'string',
							description: 'Nome do canônico.',
						},
						tipoPosProcessamento: {
							type: 'string',
							description: 'Tipo de pós-processamento do canônico.',
						},
						topicos: {
							type: 'array',
							items: {
								type: 'string',
							},
							description: 'Lista de tópicos associados ao canônico.',
						},
						formatoChave: {
							type: 'string',
							description: 'Formato da chave usada pelo canônico.',
						},
					},
					required: [
						'statusCanonico',
						'chamadas',
						'descricao',
						'versao',
						'nome',
						'tipoPosProcessamento',
						'topicos',
						'formatoChave',
					],
				},
				Chamada: {
					type: 'object',
					properties: {
						ordem: {
							type: 'integer',
							format: 'int32',
							description: 'Ordem da chamada.',
						},
						nome: {
							type: 'string',
							description: 'Nome da chamada.',
						},
						parametros: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/Parametro',
							},
							description: 'Lista de parâmetros da chamada.',
						},
						url: {
							type: 'string',
							description: 'URL da chamada.',
						},
						descricao: {
							type: 'string',
							description: 'Descrição da chamada.',
						},
					},
					required: ['ordem', 'nome', 'parametros', 'url', 'descricao'],
				},
				Parametro: {
					type: 'object',
					properties: {
						tipoDado: {
							type: 'string',
							description: 'Tipo de dado do parâmetro.',
						},
						nome: {
							type: 'string',
							description: 'Nome do parâmetro.',
						},
						tipo: {
							type: 'string',
							description: 'Tipo do parâmetro.',
						},
					},
					required: ['tipoDado', 'nome', 'tipo'],
				},
			},
		},
	},

	apis: ['./src/routes/*.ts'],
};

const openapiSpecification = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express): void {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
}
