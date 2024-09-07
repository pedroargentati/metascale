import { fetchData } from '../client/fetchDataService.js';
import { IntegrationError } from '../../errors/IntegrationError.js';
import { IParametro } from '../../interfaces/parametros.js';

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
export const fetchDataController = async (resourceUrl: string, params: IParametro[], dadosParametros: any) => {
	if (!resourceUrl || resourceUrl.trim().length === 0) {
		throw new IntegrationError('A URL da requisição não pode ser nula ou vazia.', 400);
	}

	try {
		const data = await fetchData(resourceUrl, params, dadosParametros);
		return data;
	} catch (error) {
		throw error;
	}
};
