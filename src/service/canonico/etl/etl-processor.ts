import { buildCanonical, extractCanonicalParameters } from '@internal/canonical-builder';
import { IntegrationError } from '../../../errors/IntegrationError.js';
import { IParametro } from '../../../interfaces/parametros.js';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
} from '../../../utils/constants.js';
import { getCanonicoByIdService } from '../index.js';

/**
 * Monta a string chave do registro a partir dos parâmetros das chamadas
 *
 * @param chamadas - Chamadas que foram disparadas no carregamento
 * @param dadosParametros - Dados dos parâmetros.
 * @returns Chave String que representa o dado carregado.
 */
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
export const processCanonicoDataService = async (
	canonico: any,
	requestCalls: Map<string, any>,
	dadosParametros: any,
): Promise<any> => {
	const chamadas = canonico.chamadas;

	const dadoCanonico: { ID: string; versao: number; data: any; dependencias: any } = {
		ID: calculaChavePelosParametrosDasChamadas(chamadas, dadosParametros),
		versao: canonico.versao,
		data: null,
		dependencias: {},
	};

	if (canonico.tipoPosProcessamento === CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT) {
		dadoCanonico.data = requestCalls;
	}
	if (canonico.tipoPosProcessamento === CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM) {
		dadoCanonico.data = await buildCanonical(canonico, dadosParametros, requestCalls);
	}

	dadoCanonico.dependencias = await trataDependenciasDeMerge(canonico, requestCalls);

	return dadoCanonico;
};

/**
 * @description Trata as dependências de merge.
 *
 * @param canonicoExistente Canônico existente.
 * @param requestCalls Chamadas de requisição.
 */
async function trataDependenciasDeMerge(canonicoExistente: any, requestCalls: Map<string, any>): Promise<any> {
	const dependencias: string[] = canonicoExistente.dependencias ?? [];

	if (dependencias.length === 0) {
		return null;
	}

	const reqCanonicoDependencias: Promise<any>[] = [];
	dependencias.forEach((dependencia) => {
		reqCanonicoDependencias.push(getCanonicoByIdService(dependencia));
	});
	const dependenciasCanonico = await Promise.all(reqCanonicoDependencias);

	const dadosDependencias: any = {};

	const reqExtractCanonicalParameters: Promise<any>[] = [];
	dependenciasCanonico.forEach((canonicoDependente) => {
		reqExtractCanonicalParameters.push(
			extractCanonicalParameters(canonicoExistente, canonicoDependente, requestCalls),
		);
	});
	const parametrosDependencias = await Promise.all(reqExtractCanonicalParameters);

	dependenciasCanonico.forEach((canonicoDependente, index) => {
		const parametrosCarregamentoDependencia: any[] = parametrosDependencias[index];

		dadosDependencias[canonicoDependente.nome] = [];

		parametrosCarregamentoDependencia.forEach((dadosParametro) => {
			dadosDependencias[canonicoDependente.nome].push(
				calculaChavePelosParametrosDasChamadas(canonicoDependente.chamadas, dadosParametro),
			);
		});
	});

	return dadosDependencias;
}
