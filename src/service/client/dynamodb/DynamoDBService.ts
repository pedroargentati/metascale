/** Operators */
import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

/** Services */
import logger from '../../../config/logger/logger';

/** Erros */
import { IntegrationError } from '../../../errors/IntegrationError';

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	region: process.env.AWS_REGION || 'us-west-2',
});

const dynamoDB: DocumentClient = new AWS.DynamoDB.DocumentClient();

/**
 * Classe de serviço para operações no DynamoDB.
 */
class DynamoDBService {
	private tableName: string;

	/**
	 * Construtor para inicializar o nome da tabela.
	 * @param {string} tableName - Nome da tabela do DynamoDB.
	 */
	constructor(tableName: string) {
		this.tableName = tableName;
	}

	/**
	 * Adiciona um item à tabela do DynamoDB.
	 * @param {Record<string, any>} item - Objeto a ser adicionado à tabela.
	 * @returns Promessa resolvendo em sucesso ou erro.
	 */
	public async addItem(item: Record<string, any>): Promise<any> {
		const params = {
			TableName: this.tableName,
			Item: item,
		};

		try {
			await dynamoDB.put(params).promise();
			logger.info(`Item adicionado com sucesso na tabela ${this.tableName}`);
		} catch (error) {
			throw new IntegrationError(`Erro ao adicionar item na tabela ${this.tableName}: ${error}`, 500);
		}
	}

	/**
	 * Obtém um item da tabela do DynamoDB.
	 * @param {Record<string, any>} key - Chave do item a ser obtido.
	 * @returns Promessa resolvendo em objeto contendo o item.
	 */
	public async getItem(key: Record<string, any>): Promise<any> {
		const params = {
			TableName: this.tableName,
			Key: key,
		};

		try {
			const data = await dynamoDB.get(params).promise();
			logger.info(`Retorno da tabela ${this.tableName} no dynamoDB: ${data}`);

			return data;
		} catch (error) {
			throw new IntegrationError(`Erro ao obter item na tabela ${this.tableName}: ${error}`, 500);
		}
	}

	/**
	 * Atualiza um item na tabela do DynamoDB.
	 * @param {Record<string, any>} key - Chave do item a ser atualizado.
	 * @param {string} updateExpression - Expressão de atualização do DynamoDB.
	 * @param {expressionAttributeValues} expressionAttributeValues - Valores de atributo para a expressão de atualização.
	 * @returns Promessa resolvendo em objeto contendo o item atualizado.
	 */
	public async updateItem(
		key: Record<string, any>,
		updateExpression: string,
		expressionAttributeValues: Record<string, any>,
	): Promise<any> {
		const params = {
			TableName: this.tableName,
			Key: key,
			UpdateExpression: updateExpression,
			ExpressionAttributeValues: expressionAttributeValues,
			ReturnValues: 'ALL_NEW',
		};

		try {
			const data = await dynamoDB.update(params).promise();
			logger.info(`Item atualizado com sucesso na tabela ${this.tableName}`);

			return data;
		} catch (error) {
			throw new IntegrationError(`Erro ao atualizar item na tabela ${this.tableName}: ${error}`, 500);
		}
	}

	/**
	 * Deleta um item da tabela do DynamoDB.
	 * @param {Record<string, any>} key - Chave do item a ser deletado.
	 * @returns Promessa resolvendo em sucesso ou erro.
	 */
	public async deleteItem(key: Record<string, any>): Promise<any> {
		const params = {
			TableName: this.tableName,
			Key: key,
		};

		try {
			await dynamoDB.delete(params).promise();
			logger.info(`Item deletado com sucesso na tabela ${this.tableName}`);
		} catch (error) {
			throw new IntegrationError(`Erro ao deletar item na tabela ${this.tableName}: ${error}`, 500);
		}
	}
}

export default DynamoDBService;
