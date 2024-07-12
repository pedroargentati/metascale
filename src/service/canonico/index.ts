import { get } from '../../dao';

const CANONICO_COLLECTION: string = 'canonico';

export const getCanonicoService = async (): Promise<any> => {
	const canonicos = await get(CANONICO_COLLECTION);
	return canonicos;
};
