import { IntegrationError } from '../../../errors/IntegrationError.js';
import { buildCanonical, extractCanonicalParameters } from '@internal/canonical-builder';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
} from '../../../utils/constants.js';
import { calculaChavePelosParametrosDasChamadas, processCanonicoDataService } from './etl-processor.js';
import { getCanonicoByIdService } from '../index.js';
import { ICanonico, IChamada } from '../../../interfaces/canonico.js';

// Mock da função buildCanonical para os testes
jest.mock('@internal/canonical-builder', () => ({
	buildCanonical: jest.fn(),
	extractCanonicalParameters: jest.fn(),
}));

// Mock da função getCanonicoByIdService para os testes
jest.mock('../index.js', () => ({
	getCanonicoByIdService: jest.fn(),
}));

describe('processCanonicoDataService', () => {
	const mockDadosParametros = {
		chamada1: {
			param1: 'valor1',
			param2: 'valor2',
		},
		chamada2: {
			param1: 'valor3',
		},
	};

	const mockRequestCalls = new Map().set('chamada1', 'response1').set('chamada2', 'response2');
	const mockChamadas = [
		{ nome: 'chamada1', parametros: [{ nome: 'param1' }, { nome: 'param2' }] },
		{ nome: 'chamada2', parametros: [{ nome: 'param1' }] },
	];

	test('deve calcular a chave corretamente e retornar dadoCanonico com tipoPosProcessamento DEFAULT', async () => {
		const mockCanonico: Partial<ICanonico> = {
			versao: 1,
			chamadas: mockChamadas as IChamada[],
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};
		const id = calculaChavePelosParametrosDasChamadas(mockCanonico as ICanonico, mockDadosParametros);

		const resultado = await processCanonicoDataService(
			mockCanonico as ICanonico,
			id,
			mockRequestCalls,
			mockDadosParametros,
		);

		expect(resultado.ID).toBe('valor1/valor2/valor3'); // Verificar a chave correta
		expect(resultado.versao).toBe(1);
		expect(resultado.data).toEqual(mockRequestCalls);
	});

	test('deve lançar IntegrationError se não houver parâmetros para calcular a chave', async () => {
		const mockCanonico = {
			versao: 1,
			chamadas: mockChamadas,
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};

		expect(() => calculaChavePelosParametrosDasChamadas(mockCanonico as ICanonico, {})).toThrow(IntegrationError);
	});

	test('deve processar dadoCanonico com tipoPosProcessamento CUSTOM', async () => {
		const mockCanonicoCustom = {
			versao: 1,
			chamadas: mockChamadas,
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
		};

		// Mock do retorno da função buildCanonical
		(buildCanonical as jest.Mock).mockResolvedValue('dadosCustomizados');
		const mockCanonico = {
			versao: 1,
			chamadas: mockChamadas,
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};
		const id = calculaChavePelosParametrosDasChamadas(mockCanonico as ICanonico, mockDadosParametros);

		const resultado = await processCanonicoDataService(
			mockCanonicoCustom as ICanonico,
			id,
			mockRequestCalls,
			mockDadosParametros,
		);

		expect(resultado.ID).toBe('valor1/valor2/valor3'); // Verificar a chave correta
		expect(resultado.versao).toBe(1);
		expect(resultado.data).toBe('dadosCustomizados');
		expect(buildCanonical).toHaveBeenCalledWith(mockCanonicoCustom, mockDadosParametros, mockRequestCalls);
	});

	test('deve tratar dependências de merge', async () => {
		const mockCanonicoCustom = {
			versao: 1,
			chamadas: mockChamadas,
			nome: 'canonicoCustom',
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
			dependencias: ['dependencia1'],
		};

		// Mock do retorno da função buildCanonical
		(extractCanonicalParameters as jest.Mock).mockResolvedValue([{ get: { param1: 'a' } }]);

		(getCanonicoByIdService as jest.Mock).mockResolvedValue({ nome: 'dependencia1', formatoChave: '{get:param1}' });

		const id = calculaChavePelosParametrosDasChamadas(mockCanonicoCustom as ICanonico, mockDadosParametros);

		await processCanonicoDataService(mockCanonicoCustom as ICanonico, id, mockRequestCalls, mockDadosParametros);

		expect(extractCanonicalParameters).toHaveBeenCalledTimes(1);
	});

	test('deve lançar erro ao não conseguir tratar dependências de merge', async () => {
		const mockCanonicoCustom = {
			versao: 1,
			chamadas: mockChamadas,
			nome: 'canonicoCustom',
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
			dependencias: ['dependencia1'],
		};

		// Mock do retorno da função buildCanonical
		(extractCanonicalParameters as jest.Mock).mockRejectedValue(new Error('Erro ao extrair dependências'));

		(getCanonicoByIdService as jest.Mock).mockResolvedValue({ nome: 'dependencia1', formatoChave: '{get:param1}' });

		const id = calculaChavePelosParametrosDasChamadas(mockCanonicoCustom as ICanonico, mockDadosParametros);

		try {
			await processCanonicoDataService(
				mockCanonicoCustom as ICanonico,
				id,
				mockRequestCalls,
				mockDadosParametros,
			);
		} catch (error) {
			expect(error).toBeInstanceOf(IntegrationError);
		}
	});
});
