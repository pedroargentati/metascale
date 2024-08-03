import buildCanonical from 'canonical-builder';
import { IntegrationError } from '../../../errors/IntegrationError';
import { IParametro } from '../../../interfaces/parametros';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
} from '../../../utils/constants';

const calculaChavePelosParametrosDasChamadas = (chamadas: any[], dadosParametros: any): string => {
	let chave = '';
	for (const chamada of chamadas) {
		const parametros = chamada.parametros;
		chave += parametros.reduce((acc: string, parametro: IParametro) => {
			const valor = dadosParametros[chamada.nome][parametro.nome];
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
 * @param canonico - Canônico a ser processado.
 * @param responses - Respostas das chamadas aos serviços.
 * @param dadosParametros - Dados dos parâmetros.
 * @returns Dados processados.
 */
export const processCanonicoData = (canonico: any, responses: any[], dadosParametros: any): any => {
	const chamadas = canonico.chamadas;

	const dadoCanonico: { ID: string; versao: number; data: any } = {
		ID: calculaChavePelosParametrosDasChamadas(chamadas, dadosParametros),
		versao: canonico.versao,
		data: null,
	};

	if (canonico.tipoPosProcessamento === CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT) {
		dadoCanonico.data = [];

		for (const [index, chamada] of chamadas.entries()) {
			const response = responses[index];

			dadoCanonico.data.push({
				requestName: chamada.nome,
				response: response,
			});
		}
	}
	if (canonico.tipoPosProcessamento === CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM) {
		dadoCanonico.data = buildCanonical(canonico, dadosParametros, dadoCanonico);
	}

	return dadoCanonico;
};
