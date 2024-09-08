import { CumulativeIntegrationError } from '../../../errors/CumulativeIntegrationError.js';
import { IntegrationError } from '../../../errors/IntegrationError.js';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
	enumCanonicoTipoPosProcessamento,
} from '../../../utils/constants.js';
import { quebrarStringPorChaves } from '../etl/etl-processor.js';

/** Métodos Validadores */
export const validateCanonico = (data: any): void => {
	if (!data || !Object.keys(data).length) {
		throw new IntegrationError('O corpo da requisição não pode estar vazio.', 400);
	}

	if (!data.nome || !data.descricao || !data.chamadas || !data.tipoPosProcessamento) {
		throw new IntegrationError('Os campos nome, descrição, chamadas e tipoPosProcessamento são obrigatórios.', 400);
	}

	if (!enumCanonicoTipoPosProcessamento.get(data.tipoPosProcessamento)) {
		throw new IntegrationError(
			`O campo tipoPosProcessamento deve ter algum dos valores: ${CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT} ou ${CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM}.`,
			400,
		);
	}

	const { chamadas } = data;

	if (!Array.isArray(chamadas) || !chamadas.length) {
		throw new IntegrationError('O campo chamadas deve ser um array e não pode estar vazio.', 400);
	}

	const cumulativeIntegrationExceptions: IntegrationError[] = new Array<IntegrationError>();

	for (const chamada of chamadas) {
		if (!chamada.ordem) {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(
					`O campo ordem é obrigatório para chamada ${chamada.nome || '(nome não informado.)'}.`,
					400,
				),
			);
		}

		if (!chamada.nome) {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(
					`O campo nome é obrigatório para chamada ${chamada.nome || '(nome não informado.)'}.`,
					400,
				),
			);
		}

		if (!chamada.url) {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(
					`O campo url é obrigatório para chamada ${chamada.nome || '(nome não informado.)'}.`,
					400,
				),
			);
		}

		if (!chamada.descricao) {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(
					`O campo descrição é obrigatório para chamada ${chamada.nome || '(nome não informado.)'}.`,
					400,
				),
			);
		}

		// Verificação de nomes de chamadas duplicadas
		const nameCount = chamadas.reduce((acc: { [key: string]: number }, chamada) => {
			acc[chamada.nome] = (acc[chamada.nome] || 0) + 1;
			return acc;
		}, {});

		const duplicateNames = Object.keys(nameCount).filter((name) => nameCount[name] > 1);

		duplicateNames.forEach((name) => {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(`O nome '${name}' aparece mais de uma vez nas chamadas.`, 400),
			);
		});
	}

	const formatoChave: string | undefined = data.formatoChave;

	if (!formatoChave) {
		throw new IntegrationError('O campo formatoChave é obrigatório.', 400);
	}

	// Validação do formatoChave
	validarFormatoChave(formatoChave, chamadas);

	if (cumulativeIntegrationExceptions.length) throw new CumulativeIntegrationError(cumulativeIntegrationExceptions);
};

/** Função auxiliar para validar o formato da chave */
const validarFormatoChave = (formatoChave: string, chamadas: any[]): void => {
	// Aceitar um ou mais pares de {nome:parametro} separados por qualquer sequência de caracteres, exceto {}
	const regexChaveUnicaOuMais: RegExp = /^\{[a-zA-Z]+:[a-zA-Z]+\}(.*\{[a-zA-Z]+:[a-zA-Z]+\})*$/;
	const regexChave: RegExp = /\{([a-zA-Z]+):([a-zA-Z]+)\}/g;

	if (!regexChaveUnicaOuMais.test(formatoChave)) {
		throw new IntegrationError(
			'O campo formatoChave deve ter a estrutura correta: "{nome:parametro}" ou "{nome:parametro}{separador}{nome:parametro}".',
			400,
		);
	}

	const matches: RegExpMatchArray | null = formatoChave.match(regexChave);

	if (!matches || matches.length === 0) {
		throw new IntegrationError('O campo formatoChave contém chaves inválidas.', 400);
	}

	for (const match of matches) {
		const resultado = /\{([a-zA-Z]+):([a-zA-Z]+)\}/.exec(match);
		if (!resultado || resultado.length < 3) {
			throw new IntegrationError(
				'O campo formatoChave está mal formatado. Cada chave deve seguir o padrão "{nome:parametro}".',
				400,
			);
		}
	}

	const partes: string[] = quebrarStringPorChaves(formatoChave);
	const nomesChamadas: string[] = chamadas.map((chamada) => chamada.nome);
	const parametrosChamadas: string[] = chamadas.flatMap((chamada) =>
		chamada.parametros.map((parametro: any) => parametro.nome),
	);

	for (const parte of partes) {
		const [nomeChamada, parametro] = parte.split(':');
		if (!nomesChamadas.includes(nomeChamada)) {
			throw Error(`A chamada ${nomeChamada} não foi encontrada formatoChamada.`);
		}

		if (!parametrosChamadas.includes(parametro)) {
			throw Error(`O parâmetro '${parametro}' não foi encontrado na chamada '${nomeChamada}'.`);
		}
	}
};
