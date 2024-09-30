import { buildCanonical, extractCanonicalParameters } from '@internal/canonical-builder';
import { IntegrationError } from '../../../errors/IntegrationError.js';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
} from '../../../utils/constants.js';
import { getCanonicoByIdService } from '../index.js';
import { logCanonicalInfo } from '../../../config/logger/logger.js';
import { ICanonico } from '../../../interfaces/canonico.js';

/**
 * Quebra a string de formato de chave em partes agrupadas por chaves {}.
 *
 * Exemplo: "{getCustomer:id}/{getProduct:id}/{getCustomerProduct:id}" -> ["getCustomer:id", "getProduct:id", "getCustomerProduct:id"]
 *
 * @param formatoChave - Formato da chave.
 * @returns Partes da chave.
 */
export function quebrarStringPorChaves(formatoChave: string): string[] {
	const regex: RegExp = /\{(.*?)\}/g;
	const matches: RegExpMatchArray = formatoChave.match(regex)!;
	const resultados: string[] = matches.map((match) => match.slice(1, -1));

	return resultados;
}

/**
 * Monta a string chave do registro a partir dos parâmetros das chamadas e do formato da chave do canônico.
 *
 * @param canonico - Canônico que terá a chave calculada.
 * @param dadosParametros - Dados dos parâmetros base para a montagem da chave.
 * @returns Chave String que representa o dado carregado.
 */
export const calculaChavePelosParametrosDasChamadas = (canonico: ICanonico, dadosParametros: any): string => {
	const formatoChave: string = canonico.formatoChave;

	const partesDaChave: string[] = quebrarStringPorChaves(formatoChave);

	let formatoChaveRemontada: string = '';
	let chave: string = partesDaChave.reduce((acc: string, parte: string) => {
		formatoChaveRemontada += `{${parte}}`;

		const fimDaParteAtual = formatoChaveRemontada.length;
		const inicioProximaParte = formatoChave.indexOf('{', fimDaParteAtual);

		let delimitador: string = '';
		if (inicioProximaParte !== -1) {
			delimitador = formatoChave.substring(fimDaParteAtual, inicioProximaParte);
			formatoChaveRemontada += delimitador;
		}

		const [nomeChamada, nomeParametro] = parte.split(':');
		const valorParametro = dadosParametros?.[nomeChamada]?.[nomeParametro];

		if (!valorParametro) {
			throw new IntegrationError(
				`Faltam parâmetros para montar a chave do canônico ${canonico.nome} utilizando o formato de chave ${canonico.formatoChave}`,
				400,
			);
		}

		return acc + valorParametro + delimitador;
	}, '');

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
	canonico: ICanonico,
	id: string,
	requestCalls: Map<string, any>,
	dadosParametros: any,
): Promise<any> => {
	const dadoCanonico: { ID: string; versao: number; data: any; dependencias: any } = {
		ID: id,
		versao: canonico.versao ?? 1,
		data: null,
		dependencias: {},
	};

	if (canonico.tipoPosProcessamento === CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT) {
		dadoCanonico.data = requestCalls;
	}
	if (canonico.tipoPosProcessamento === CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM) {
		dadoCanonico.data = await buildCanonical(canonico, dadosParametros, requestCalls);
	}

	try {
		dadoCanonico.dependencias = await trataDependenciasDeMerge(id, canonico, requestCalls, dadosParametros);
	} catch (error: any) {
		throw new IntegrationError(
			`Erro ao tratar(extrair) dependências do canônico ${canonico.nome}: ${error.message}`,
			400,
		);
	}

	return dadoCanonico;
};

/**
 * @description Trata as dependências de merge.
 *
 * @param canonicoExistente Canônico existente.
 * @param requestCalls Chamadas de requisição.
 */
async function trataDependenciasDeMerge(
	id: string,
	canonicoExistente: ICanonico,
	requestCalls: Map<string, any>,
	dadosParametros: any,
): Promise<any> {
	const dependencias: string[] = canonicoExistente.dependencias ?? [];

	if (dependencias.length === 0) {
		return null;
	}

	logCanonicalInfo(canonicoExistente.nome, id, `Tratando dependências de merge`);

	const reqCanonicoDependencias: Promise<any>[] = [];
	dependencias.forEach((dependencia) => {
		reqCanonicoDependencias.push(getCanonicoByIdService(dependencia));
	});
	const dependenciasCanonico = await Promise.all(reqCanonicoDependencias);

	const dadosDependencias: any = {};

	const reqExtractCanonicalParameters: Promise<any>[] = [];
	dependenciasCanonico.forEach((canonicoDependente) => {
		reqExtractCanonicalParameters.push(
			extractCanonicalParameters(canonicoExistente, canonicoDependente, requestCalls, dadosParametros),
		);
	});
	const parametrosDependencias = await Promise.all(reqExtractCanonicalParameters);

	dependenciasCanonico.forEach((canonicoDependente, index) => {
		const parametrosCarregamentoDependencia: any[] = parametrosDependencias[index];

		dadosDependencias[canonicoDependente.nome] = [];

		parametrosCarregamentoDependencia.forEach((dadosParametro) => {
			dadosDependencias[canonicoDependente.nome].push(
				calculaChavePelosParametrosDasChamadas(canonicoDependente, dadosParametro),
			);
		});
	});

	logCanonicalInfo(canonicoExistente.nome, id, `Dependências de merge tratadas`);

	return dadosDependencias;
}
