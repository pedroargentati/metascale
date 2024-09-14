import { IntegrationError } from '../../../errors/IntegrationError.js';
import { buildCanonical } from '@internal/canonical-builder';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
} from '../../../utils/constants.js';
import { processCanonicoDataService } from './etl-processor.js';

// Mock da função buildCanonical para os testes
jest.mock('@internal/canonical-builder', () => ({
	buildCanonical: jest.fn(),
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
		const mockCanonico = {
			versao: 1,
			chamadas: mockChamadas,
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};

		const resultado = await processCanonicoDataService(mockCanonico, mockRequestCalls, mockDadosParametros);

		expect(resultado.ID).toBe('valor1/valor2/valor3'); // Verificar a chave correta
		expect(resultado.versao).toBe(1);
		expect(resultado.data).toEqual(mockRequestCalls);
	});

	test('deve lançar IntegrationError se não houver parâmetros para calcular a chave', async () => {
		const mockCanonicoSemParametros = {
			versao: 1,
			chamadas: [{ nome: 'chamada1', parametros: [] }],
			formatoChave: '{chamada1:param1}/{chamada1:param2}/{chamada2:param1}',
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};

		await expect(processCanonicoDataService(mockCanonicoSemParametros, mockRequestCalls, {})).rejects.toThrow(
			IntegrationError,
		);
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

		const resultado = await processCanonicoDataService(mockCanonicoCustom, mockRequestCalls, mockDadosParametros);

		expect(resultado.ID).toBe('valor1/valor2/valor3'); // Verificar a chave correta
		expect(resultado.versao).toBe(1);
		expect(resultado.data).toBe('dadosCustomizados');
		expect(buildCanonical).toHaveBeenCalledWith(mockCanonicoCustom, mockDadosParametros, mockRequestCalls);
	});
});
