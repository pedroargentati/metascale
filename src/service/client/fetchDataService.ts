/** Operators */
import axios from 'axios';

/** Errors */
import { IntegrationError } from '../../errors/IntegrationError';

/** Interfaces */
import { IParametro } from '../../interfaces/parametros';

/**
 * Realiza a requisição GET.
 *
 * @param {string} resourceUrl URL da requisição.
 * @param {IParametro[]} parametros Parâmetros da requisição.
 * @returns Dados da requisição.
 */
export const fetchData = async (resourceUrl: string, parametros: IParametro[] = new Array<IParametro>()) => {
	const { url, queryParams } = handleParameters(resourceUrl, parametros);

	const response = await axios.get(url, { params: queryParams });

	if (response.status !== 200) {
		throw new IntegrationError('Requisição GET falhou com o status:', response.status);
	}

	return response.data;
};

/**
 * Manipula os parâmetros da requisição.
 *
 * @param resourceUrl URL da requisição.
 * @param {IParametro[]} parametros Parâmetros da requisição.
 * @returns URL e query params da requisição.
 */
export const handleParameters = (resourceUrl: string, parametros: IParametro[]) => {
	let url: string = resourceUrl;
	const queryParams: { [key: string]: string | number | boolean } = {};

	for (const param of parametros) {
		if (param.tipo === 'path') {
			// Substitui path params na URL
			url = url.replace(`{${param.nome}}`, String(param.tipoDado));
		} else if (param.tipo === 'query') {
			// Adiciona query params ao objeto queryParams
			queryParams[param.nome] = param.tipoDado;
		}
	}

	return { url, queryParams };
};
