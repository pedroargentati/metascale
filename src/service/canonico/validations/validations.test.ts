import { CumulativeIntegrationError } from '../../../errors/CumulativeIntegrationError';
import { IntegrationError } from '../../../errors/IntegrationError';
import { CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT } from '../../../utils/constants';
import { validateCanonico } from './validations';

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
		const data = { nome: 'Nome', descricao: 'Descricao', tipoPosProcessamento: '' };
		expect(() => validateCanonico(data)).toThrow(IntegrationError);
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
