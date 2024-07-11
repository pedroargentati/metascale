import { getCanonicoBanco } from '../../dao/canonico';
import { ICanonico } from '../../models/canonico';

export const getCanonicoService = async (): Promise<ICanonico[]> => {
	return await getCanonicoBanco();
};
