import { get, getOne } from '../../dao';

const CANONICO_COLLECTION: string = 'canonico';

export const getCanonicoService = async (): Promise<any> => {
	const canonicos = await get(CANONICO_COLLECTION);
	return canonicos;
};

export const getCanonicoByIdService = async (id: string): Promise<any> => {
	const canonicos = await getOne(CANONICO_COLLECTION, id);
	return canonicos;
};
