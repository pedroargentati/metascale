import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGO_URI: string = process.env.MONGO_URI!;
if (!MONGO_URI) {
	throw new Error('MONGO_URI não foi localizada. Verifique o arquivo .env');
}

/**
 * Create a new MongoClient instance with the provided MONGO_URI and ServerApiVersion.v1
 */
const mongoClient: MongoClient = new MongoClient(MONGO_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export default mongoClient;
