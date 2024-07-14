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

	for (const chamada of chamadas) {
		if (!chamada.ordem) {
			throw new IntegrationError('[Objeto Chamada] O campo ordem é obrigatório.', 400);
		}

		if (!chamada.nome) {
			throw new IntegrationError('[Objeto Chamada] O campo nome é obrigatório.', 400);
		}

		if (!chamada.url) {
			throw new IntegrationError('[Objeto Chamada] O campo url é obrigatório.', 400);
		}

		if (!chamada.descricao) {
			throw new IntegrationError('[Objeto Chamada] O campo descrição é obrigatório.', 400);
		}

		if (!chamada.parametros) {
			throw new IntegrationError('[Objeto Chamada] O campo parametros é obrigatório.', 400);
		}

		if (!chamada.estrutura) {
			throw new IntegrationError('[Objeto Chamada] O campo estrutura é obrigatório.', 400);
		}

		const { parametros, estrutura } = chamada;

		if (!Array.isArray(parametros) || !parametros.length) {
			throw new IntegrationError('O campo parametros deve ser um array e não pode estar vazio.', 400);
		}

		if (!Array.isArray(estrutura) || !estrutura.length) {
			throw new IntegrationError('O campo estrutura deve ser um array e não pode estar vazio.', 400);
		}
	}
};
