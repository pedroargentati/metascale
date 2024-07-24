import { IntegrationError } from '../../../errors/IntegrationError';
import { IParametro } from '../../../interfaces/parametros';

const calculaChavePelosParametrosDasChamadas = (chamadas: any[], dadosParametros: any): string => {
	let chave = '';
	for (const chamada of chamadas) {
		const parametros = chamada.parametros;
		chave += parametros.reduce((acc: string, parametro: IParametro) => {
			const valor = dadosParametros[parametro.nome];
			return acc + valor;
		}, '');
	}

	if (!chave) {
		throw new IntegrationError('Não existem parâmetros para calcular a chave do registro a ser carregado.', 400);
	}

	return chave;
};

/**
 * Processa os dados recebidos e monta o canônico conforme os metadados.
 *
 * @param data - Dados de entrada.
 * @param responses - Respostas das chamadas aos serviços.
 * @returns Dados processados.
 */
export const processCanonicoData = (chamadas: any[], responses: any[], dadosParametro: any): any => {
	const dadoCanonico: { ID: string; data: any[] } = {
		ID: calculaChavePelosParametrosDasChamadas(chamadas, dadosParametro),
		data: [],
	};

	for (const [index, chamada] of chamadas.entries()) {
		const response = responses[index];

		dadoCanonico.data.push({
			requestName: chamada.nome,
			response: response,
		});
	}

	return dadoCanonico;
};
