import { CumulativeIntegrationError } from '../../../errors/CumulativeIntegrationError';
import { IntegrationError } from '../../../errors/IntegrationError';

/** Métodos Validadores */
export const validateCanonico = (data: any): void => {
	if (!data || !Object.keys(data).length) {
		throw new IntegrationError('O corpo da requisição não pode estar vazio.', 400);
	}

	if (!data.nome || !data.descricao || !data.chamadas) {
		throw new IntegrationError('Os campos nome, descrição e chamadas são obrigatórios.', 400);
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

		if (!chamada.parametros) {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(
					`O campo parametros é obrigatório para chamada ${chamada.nome || '(nome não informado.)'}.`,
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

		const { parametros } = chamada;

		if (!Array.isArray(parametros) || !parametros.length) {
			cumulativeIntegrationExceptions.push(
				new IntegrationError(
					`O campo parametros deve ser um array e não pode estar vazio para chamada ${chamada.nome || '(nome não informado.)'}.`,
					400,
				),
			);
		}
	}

	if (cumulativeIntegrationExceptions.length) throw new CumulativeIntegrationError(cumulativeIntegrationExceptions);
};
