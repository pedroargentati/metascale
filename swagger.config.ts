import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		tags: [{ name: 'Canonicos' }, { name: 'Job' }, { name: 'Other' }],
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
						id: {
							type: 'string',
							description: 'O identificador único do canônico.',
						},
						nome: {
							type: 'string',
							description: 'O nome do canônico.',
						},
						descricao: {
							type: 'string',
							description: 'Uma descrição do canônico.',
						},
					},
					required: ['id', 'nome'],
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
