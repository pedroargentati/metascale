import { fetchData } from '../client/fetchDataService';
import { IntegrationError } from '../../errors/IntegrationError';
import { IParametro } from '../../interfaces/parametros';

/**
 * Função para buscar dados de uma URL.
 *
 * @param resourceUrl - URL da requisição.
 * @param params - Parâmetros da URL.
 * @param data - Dados da requisição.
 *
 * @throws IntegrationError
 * @returns Retorna os dados da requisição.
 */
export const fetchDataController = async (resourceUrl: string, params: IParametro[], data: any) => {
	if (!resourceUrl || resourceUrl.trim().length === 0) {
		throw new IntegrationError('A URL da requisição não pode ser nula ou vazia.', 400);
	}

	try {
		const data = await fetchData(resourceUrl, params);
		return data;
	} catch (error) {
		throw new IntegrationError('Erro ao tentar buscar dados da URL.', 500);
	}
};
