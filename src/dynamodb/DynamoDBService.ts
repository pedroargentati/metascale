/** Operators */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	PutCommand,
	GetCommand,
	UpdateCommand,
	DeleteCommand,
	PutCommandOutput,
	GetCommandOutput,
	UpdateCommandOutput,
	DeleteCommandOutput,
	ScanCommand,
	ScanCommandOutput,
	NativeAttributeValue,
} from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';

/** Services */
import logger from '../config/logger/logger';

/** Erros */
import { IntegrationError } from '../errors/IntegrationError';

// Configurar o cliente DynamoDB
const client = new DynamoDBClient({
	region: process.env.AWS_REGION || 'us-west-2',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

// Criar o cliente DynamoDBDocument
const dynamoDB = DynamoDBDocumentClient.from(client);

/**
 * Classe de serviço para operações no DynamoDB.
 *
 * @see https://www.npmjs.com/package/@aws-sdk/client-dynamodb
 */
class DynamoDBService {
	private tableName: string;
	private static instance: DynamoDBService;

	/**
	 * Construtor privado para evitar instanciamento direto.
	 * @param {string} tableName - Nome da tabela do DynamoDB.
	 */
	private constructor(tableName: string) {
		this.tableName = tableName;
	}

	/**
	 * Método estático para obter a instância única do serviço.
	 * @param {string} tableName - Nome da tabela do DynamoDB.
	 * @returns Instância única de DynamoDBService.
	 */
	public static getInstance(tableName: string): DynamoDBService {
		if (!DynamoDBService.instance) {
			DynamoDBService.instance = new DynamoDBService(tableName);
		}
		return DynamoDBService.instance;
	}

	/**
	 * Adiciona um item à tabela do DynamoDB.
	 * @param {Record<string, any>} item - Objeto a ser adicionado à tabela.
	 * @returns Promessa resolvendo em sucesso ou erro.
	 */
	public async addItem(item: Record<string, any>): Promise<PutCommandOutput> {
		const params = {
			TableName: this.tableName,
			Item: item,
		};

		try {
			const data = await dynamoDB.send(new PutCommand(params));
			logger.info(`Item adicionado com sucesso na tabela ${this.tableName}`);
			return data;
		} catch (error) {
			throw new IntegrationError(`Erro ao adicionar item na tabela ${this.tableName}: ${error}`, 500);
		}
	}

	/**
	 * Obtém um item da tabela do DynamoDB.
	 * @param {Record<string, any>} key - Chave do item a ser obtido.
	 * @returns Promessa resolvendo em objeto contendo o item.
	 */
	public async getItem(key: Record<string, any>): Promise<Record<string, NativeAttributeValue> | null> {
		const params = {
			TableName: this.tableName,
			Key: key,
		};

		try {
			const data = await dynamoDB.send(new GetCommand(params));

			logger.info(
				`Retorno da tabela ${this.tableName} com a key ${JSON.stringify(key)} no dynamoDB: ${JSON.stringify(data)}`,
			);

			return data?.Item || null;
		} catch (error) {
			throw new IntegrationError(`Erro ao obter item na tabela ${this.tableName}: ${error}`, 500);
		}
	}

	/**
	 * Atualiza um item na tabela do DynamoDB.
	 * @param {Record<string, any>} key - Chave do item a ser atualizado.
	 * @param {string} updateExpression - Expressão de atualização do DynamoDB.
	 * @param {Record<string, any>} expressionAttributeValues - Valores de atributo para a expressão de atualização.
	 * @param {Record<string, string>} [expressionAttributeNames] - Nomes de atributo para a expressão de atualização.
	 * @returns Promessa resolvendo em objeto contendo o item atualizado.
	 */
	public async updateItem(
		key: Record<string, any>,
		updateExpression: string,
		expressionAttributeValues: Record<string, any>,
		expressionAttributeNames?: Record<string, string>,
	): Promise<UpdateCommandOutput> {
		const params = {
			TableName: this.tableName,
			Key: key,
			UpdateExpression: updateExpression,
			ExpressionAttributeValues: expressionAttributeValues,
			ExpressionAttributeNames: expressionAttributeNames,
			ReturnValues: 'ALL_NEW' as ReturnValue,
		};

		try {
			const data = await dynamoDB.send(new UpdateCommand(params));
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
	public async deleteItem(key: Record<string, any>): Promise<DeleteCommandOutput> {
		const params = {
			TableName: this.tableName,
			Key: key,
		};

		try {
			const data = await dynamoDB.send(new DeleteCommand(params));
			logger.info(`Item deletado com sucesso na tabela ${this.tableName}`);
			return data;
		} catch (error) {
			throw new IntegrationError(`Erro ao deletar item na tabela ${this.tableName}: ${error}`, 500);
		}
	}

	/**
	 * Busca todos os itens da tabela do DynamoDB.
	 * @returns Promessa resolvendo em uma lista contendo todos os itens.
	 */
	public async getAllItems(): Promise<Record<string, any>[]> {
		const params = {
			TableName: this.tableName,
		};

		try {
			const data = await dynamoDB.send(new ScanCommand(params));
			logger.info(`Todos os itens da tabela ${this.tableName} foram buscados com sucesso`);
			return data.Items || [];
		} catch (error) {
			throw new IntegrationError(`Erro ao buscar todos os itens da tabela ${this.tableName}: ${error}`, 500);
		}
	}
}

export default DynamoDBService;
