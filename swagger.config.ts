import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Metascale API',
			version: '1.0.0',
			description: 'API Documentation for Metascale project',
			contact: {
				name: 'Cicada',
			},
			servers: [
				{
					url: 'http://localhost:8000',
				},
			],
		},
	},
	apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express): void {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
