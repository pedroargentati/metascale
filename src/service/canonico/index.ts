import { getCanonicoBanco } from '../../dao/canonico';

export const getCanonicoService = async (id: number): Promise<any> => {
	return await getCanonicoBanco(id);
};
