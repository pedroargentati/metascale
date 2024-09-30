import { CumulativeIntegrationError } from '../../../errors/CumulativeIntegrationError.js';
import { IntegrationError } from '../../../errors/IntegrationError.js';
import { ICanonico } from '../../../interfaces/canonico.js';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
} from '../../../utils/constants.js';
import { validateCanonico } from './validations.js';

// Simulação do enumCanonicoTipoPosProcessamento para os testes
const enumCanonicoTipoPosProcessamento = new Map([
	[CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT, true],
	[CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM, true],
]);

describe('validateCanonico', () => {
	it('deve lançar um IntegrationError se os dados forem nulos ou vazios', () => {
		expect(() => validateCanonico(null!)).toThrow(IntegrationError);
		expect(() => validateCanonico({} as any)).toThrow(IntegrationError);
	});

	it('deve lançar um IntegrationError se os campos obrigatórios estiverem ausentes', () => {
		const data = { nome: 'Nome', descricao: 'Descricao' }; // faltando chamadas e tipoPosProcessamento
		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);
	});

	it('deve lançar um IntegrationError se tipoPosProcessamento for um valor inválido', () => {
		const data = { nome: 'Nome', descricao: 'Descricao', tipoPosProcessamento: 'INVALIDO' };
		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);
	});

	it('deve lançar um CumulativeIntegrationError se chamadas.ordem não for informada', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					nome: 'Chamada1', // ordem não informada
					url: 'http://example.com',
					descricao: 'Descricao',
				},
			],
			formatoChave: '{getCustomer:id}',
		};

		expect(() => validateCanonico(data as any)).toThrow(CumulativeIntegrationError);
	});

	it('deve lançar um IntegrationError se tipoPosProcessamento for um valor inválido', () => {
		// Dados de teste com campos obrigatórios válidos, mas tipoPosProcessamento inválido
		const data = {
			nome: 'Nome', // Campo obrigatório presente
			descricao: 'Descricao', // Campo obrigatório presente
			chamadas: [{}], // Campo obrigatório presente, assumindo que chamadas pode ser um array vazio
			tipoPosProcessamento: 'VALOR_INVALIDO', // Valor inválido para o teste
		};

		// Este teste deve lançar um IntegrationError por causa do tipoPosProcessamento inválido
		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);
		expect(() => validateCanonico(data as any)).toThrow(
			`O campo tipoPosProcessamento deve ter algum dos valores: ${CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT} ou ${CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM}.`,
		);
	});

	it('deve lançar um CumulativeIntegrationError se chamadas.url não for informada', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					ordem: 1,
					nome: 'Chamada1',
					descricao: 'Descricao',
					// url não informada
				},
			],
		};

		try {
			validateCanonico(data as any);
		} catch (error) {
			expect(error).toBeInstanceOf(CumulativeIntegrationError);
			expect((error as CumulativeIntegrationError).exceptions).toContainEqual(
				expect.objectContaining({
					message: `O campo url é obrigatório para chamada Chamada1.`,
				}),
			);
		}
	});

	it('deve lançar um CumulativeIntegrationError se chamadas.descricao não for informada', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					ordem: 1,
					nome: 'Chamada1',
					url: 'http://example.com',
					// descrição não informada
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow(CumulativeIntegrationError);
	});

	it('deve lançar um IntegrationError se chamadas não for um array ou estiver vazio', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: {},
		}; // chamadas não é um array
		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);

		data.chamadas = []; // chamadas é um array vazio
		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);
	});

	it('deve lançar um CumulativeIntegrationError se chamadas tiver campos ausentes', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [{ nome: 'Chamada1' }], // faltando campos obrigatórios em chamadas
		};

		expect(() => validateCanonico(data as any)).toThrow(CumulativeIntegrationError);
	});

	it('deve lançar um CumulativeIntegrationError se chamadas.nome não for informada.', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					ordem: 1,
					nome: '', // nome não informado
					url: 'http://example.com',
					descricao: 'Descricao',
					parametros: {}, // não é um array
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow(CumulativeIntegrationError);
	});

	it('deve lançar um CumulativeIntegrationError informando na mensagem que não tem o nome da chamada.', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					nome: '', // nome não informado
					parametros: {}, // não é um array
				},
			],
		};

		try {
			validateCanonico(data as any);
		} catch (err: any) {
			expect(err.exceptions[0].message).toBe('O campo ordem é obrigatório para chamada (nome não informado.).');
			expect(err.exceptions[1].message).toBe('O campo nome é obrigatório para chamada (nome não informado.).');
			expect(err.exceptions[2].message).toBe('O campo url é obrigatório para chamada (nome não informado.).');
			expect(err.exceptions[3].message).toBe(
				'O campo descrição é obrigatório para chamada (nome não informado.).',
			);
		}
	});

	it('deve lançar um CumulativeIntegrationError se chamadas possui o campo name repetido ', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					ordem: 1,
					nome: 'Chamada1', // nome repetido
					url: 'http://example.com',
					descricao: 'Descricao',
					parametros: [{ nome: 'param1' }],
				},
				{
					ordem: 1,
					nome: 'Chamada1', // nome repetido
					url: 'http://example.com',
					descricao: 'Descricao',
					parametros: [{ nome: 'param1' }],
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow(CumulativeIntegrationError);
	});

	it('não deve lançar um erro se todos os campos obrigatórios estiverem presentes e válidos', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					ordem: 1,
					nome: 'Chamada1',
					url: 'http://example.com',
					descricao: 'Descricao',
					parametros: [{ nome: 'param1' }],
				},
			],
			formatoChave: '{Chamada1:param1}',
		};

		expect(() => validateCanonico(data as any)).not.toThrow();
	});
});

describe('validateCanonico - formatoChave', () => {
	it('deve lançar um IntegrationError se formatoChave estiver ausente', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [
				{
					nome: 'getCustomer',
					parametros: [{ nome: 'id' }],
					ordem: 1,
					url: 'http://example.com',
					descricao: 'Descricao',
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);
		expect(() => validateCanonico(data as any)).toThrow('O campo formatoChave é obrigatório.');
	});

	it('deve lançar um IntegrationError se formatoChave estiver mal formatado', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			formatoChave: '{invalid_format}',
			chamadas: [
				{
					nome: 'getCustomer',
					parametros: [{ nome: 'id' }],
					ordem: 1,
					url: 'http://example.com',
					descricao: 'Descricao',
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow(IntegrationError);
		expect(() => validateCanonico(data as any)).toThrow(
			'O campo formatoChave deve ter a estrutura correta: "{nome:parametro}" ou "{nome:parametro}{separador}{nome:parametro}".',
		);
	});

	it('deve lançar um erro se formatoChave conter chaves não encontradas nas chamadas', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			formatoChave: '{getInvalid:id}',
			chamadas: [
				{
					nome: 'getCustomer',
					parametros: [{ nome: 'id' }],
					ordem: 1,
					url: 'http://example.com',
					descricao: 'Descricao',
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow();
		expect(() => validateCanonico(data as any)).toThrow('A chamada getInvalid não foi encontrada formatoChamada.');
	});

	it('deve lançar um erro se o parâmetro no formatoChave não for encontrado nos parâmetros das chamadas', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			formatoChave: '{getCustomer:invalidParam}',
			chamadas: [
				{
					nome: 'getCustomer',
					parametros: [{ nome: 'id' }],
					ordem: 1,
					url: 'http://example.com',
					descricao: 'Descricao',
				},
			],
		};

		expect(() => validateCanonico(data as any)).toThrow();
		expect(() => validateCanonico(data as any)).toThrow(
			"O parâmetro 'invalidParam' não foi encontrado na chamada 'getCustomer'.",
		);
	});

	it('não deve lançar erro se formatoChave estiver corretamente formatado', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			formatoChave: '{getCustomer:id}',
			chamadas: [
				{
					nome: 'getCustomer',
					parametros: [{ nome: 'id' }],
					ordem: 1,
					url: 'http://example.com',
					descricao: 'Descricao',
				},
			],
		};

		expect(() => validateCanonico(data as any)).not.toThrow();
	});
});
