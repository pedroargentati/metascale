import { Collection, Db, ObjectId } from 'mongodb';
import mg from '../config/db';

const METASCALE_DB: string = 'metascale';

/** Callback que é chamada para recuperar a collection. */
type Operacao<T> = (col: Collection<Document>) => Promise<T>;

/**
 * Executa uma operação no banco de dados.
 *
 * @param {string} collection Nome da coleção.
 * @param {Operacao} operacao Operação a ser executada.
 */
async function executaOperacao<T>(collection: string, operacao: Operacao<T>): Promise<T> {
	console.log(`[DB :: Canonico] Iniciando operação na collection: ${collection}.`);
	try {
		await mg.connect();

		const db: Db = mg.db(METASCALE_DB);
		const col: Collection<Document> = db.collection(collection);

		return await operacao(col);
	} catch (error) {
		console.error(`[DB :: Canonico] Erro ao executar a operação: ${error}`);
		throw error;
	} finally {
		await mg.close();
	}
}

/**
 * Retorna todas as coleções do banco de dados.
 */
export async function get(collection: string) {
	console.log(`[DB :: Canonico] Iniciando operação get: ${collection}.`);
	return executaOperacao(collection, async (col: Collection<Document>) => {
		return await col.find().toArray();
	});
}

/**
 * Retorna uma coleção do banco de dados.
 */
export async function getOne(collection: string, id: string): Promise<any> {
	console.log(`[DB :: Canonico] Iniciando operação getOne: ${collection}.`);
	return executaOperacao(collection, async (col: Collection<Document>) => {
		return await col.findOne({ _id: new ObjectId(id) });
	});
}

/**
 * Insere um documento no banco de dados.
 */
export async function insert(collection: string, data: any): Promise<any> {
	console.log(`[DB :: Canonico] Iniciando operação insert: ${collection}.`);
	return executaOperacao(collection, async (col: Collection<Document>) => {
		return await col.insertOne(data);
	});
}

// Update one document
export async function update(collection: string, id: string, data: any): Promise<any> {
	console.log(`[DB :: Canonico] Iniciando operação update: ${collection}.`);

	return executaOperacao(collection, async (col: Collection<Document>) => {
		return await col.updateOne({ _id: new ObjectId(id) }, { $set: data });
	});
}

// Delete one document
export async function deleteOne(collection: string, id: string): Promise<any> {
	console.log(`[DB :: Canonico] Iniciando operação deleteOne: ${collection}.`);
	return executaOperacao(collection, async (col: Collection<Document>) => {
		return await col.deleteOne({ _id: new ObjectId(id) });
	});
}
