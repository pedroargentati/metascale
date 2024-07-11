// config/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log('Conectado ao MongoDB!');
	} catch (error: any) {
		console.error('Conexão com o MongoDB falhou:', error.message);
		process.exit(1);
	}
};

export default connectDB;
