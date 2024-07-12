import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGO_URI: string =
	'mongodb+srv://gkazukionishi:5UtFlBjb2hX3KAOT@metascale01.pkk8qir.mongodb.net/?retryWrites=true&w=majority&appName=Metascale01';

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
