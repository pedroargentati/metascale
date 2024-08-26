import { IntegrationError } from '../../../errors/IntegrationError';
import { buildCanonical } from '@internal/canonical-builder';
import {
	CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
	CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
} from '../../../utils/constants';
import { processCanonicoDataService } from './etl-processor';

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

	const mockResponses = ['response1', 'response2'];
	const mockChamadas = [
		{ nome: 'chamada1', parametros: [{ nome: 'param1' }, { nome: 'param2' }] },
		{ nome: 'chamada2', parametros: [{ nome: 'param1' }] },
	];

	test('deve calcular a chave corretamente e retornar dadoCanonico com tipoPosProcessamento DEFAULT', async () => {
		const mockCanonico = {
			versao: 1,
			chamadas: mockChamadas,
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};

		const resultado = await processCanonicoDataService(mockCanonico, mockResponses, mockDadosParametros);

		expect(resultado.ID).toBe('valor1valor2valor3'); // Verificar a chave correta
		expect(resultado.versao).toBe(1);
		expect(resultado.data).toEqual([
			{ requestName: 'chamada1', response: 'response1' },
			{ requestName: 'chamada2', response: 'response2' },
		]);
	});

	test('deve lançar IntegrationError se não houver parâmetros para calcular a chave', async () => {
		const mockCanonicoSemParametros = {
			versao: 1,
			chamadas: [{ nome: 'chamada1', parametros: [] }],
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT,
		};

		await expect(processCanonicoDataService(mockCanonicoSemParametros, mockResponses, {})).rejects.toThrow(
			IntegrationError,
		);
	});

	test('deve processar dadoCanonico com tipoPosProcessamento CUSTOM', async () => {
		const mockCanonicoCustom = {
			versao: 1,
			chamadas: mockChamadas,
			tipoPosProcessamento: CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM,
		};

		// Mock do retorno da função buildCanonical
		(buildCanonical as jest.Mock).mockResolvedValue('dadosCustomizados');

		const resultado = await processCanonicoDataService(mockCanonicoCustom, mockResponses, mockDadosParametros);

		expect(resultado.ID).toBe('valor1valor2valor3'); // Verificar a chave correta
		expect(resultado.versao).toBe(1);
		expect(resultado.data).toBe('dadosCustomizados');
		expect(buildCanonical).toHaveBeenCalledWith(mockCanonicoCustom, mockDadosParametros, resultado);
	});
});
