import mongoose, { Document, Schema } from 'mongoose';

interface ICanonico extends Document {
	name: string;
	description: string;
	price: number;
	category: string;
	image: string;
	stock: number;
	created_at: Date;
	updated_at: Date;
}

const canonicoSchema: Schema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	category: { type: String, required: true },
	image: { type: String, required: true },
	stock: { type: Number, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const Canonico = mongoose.model<ICanonico>('Canonico', canonicoSchema);

export default Canonico;
export { ICanonico };
