import { CumulativeIntegrationError } from '../../../errors/CumulativeIntegrationError';
import { IntegrationError } from '../../../errors/IntegrationError';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
} from '../../../utils/constants';
import { validateCanonico } from './validations';

// Simulação do enumCanonicoTipoPosProcessamento para os testes
const enumCanonicoTipoPosProcessamento = new Map([
	[CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT, true],
	[CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM, true],
]);

describe('validateCanonico', () => {
	it('deve lançar um IntegrationError se os dados forem nulos ou vazios', () => {
		expect(() => validateCanonico(null)).toThrow(IntegrationError);
		expect(() => validateCanonico({})).toThrow(IntegrationError);
	});

	it('deve lançar um IntegrationError se os campos obrigatórios estiverem ausentes', () => {
		const data = { nome: 'Nome', descricao: 'Descricao' }; // faltando chamadas e tipoPosProcessamento
		expect(() => validateCanonico(data)).toThrow(IntegrationError);
	});

	it('deve lançar um IntegrationError se tipoPosProcessamento for um valor inválido', () => {
		const data = { nome: 'Nome', descricao: 'Descricao', tipoPosProcessamento: 'INVALIDO' };
		expect(() => validateCanonico(data)).toThrow(IntegrationError);
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
		};

		expect(() => validateCanonico(data)).toThrow();
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
		expect(() => validateCanonico(data)).toThrow(IntegrationError);
		expect(() => validateCanonico(data)).toThrow(
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
			validateCanonico(data);
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

		expect(() => validateCanonico(data)).toThrow(CumulativeIntegrationError);
	});

	it('deve lançar um IntegrationError se chamadas não for um array ou estiver vazio', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: {},
		}; // chamadas não é um array
		expect(() => validateCanonico(data)).toThrow(IntegrationError);

		data.chamadas = []; // chamadas é um array vazio
		expect(() => validateCanonico(data)).toThrow(IntegrationError);
	});

	it('deve lançar um CumulativeIntegrationError se chamadas tiver campos ausentes', () => {
		const data = {
			nome: 'Nome',
			descricao: 'Descricao',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
			chamadas: [{ nome: 'Chamada1' }], // faltando campos obrigatórios em chamadas
		};

		expect(() => validateCanonico(data)).toThrow(CumulativeIntegrationError);
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

		expect(() => validateCanonico(data)).toThrow(CumulativeIntegrationError);
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

		expect(() => validateCanonico(data)).toThrow(CumulativeIntegrationError);
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
		};

		expect(() => validateCanonico(data)).not.toThrow();
	});
});
