// processCanonicoData.test.ts

import { processCanonicoData } from './etl-processor';

// describe('processCanonicoData', () => {
// 	it('deve processar os dados corretamente com entradas válidas', () => {
// 		const chamadas = [{ nome: 'chamada1' }, { nome: 'chamada2' }];
// 		const responses = [{ data: 'resposta1' }, { data: 'resposta2' }];

// 		const expectedOutput = [
// 			{
// 				requestName: 'chamada1',
// 				response: { data: 'resposta1' },
// 			},
// 			{
// 				requestName: 'chamada2',
// 				response: { data: 'resposta2' },
// 			},
// 		];

// 		const result = processCanonicoData(chamadas, responses);
// 		expect(result).toEqual(expectedOutput);
// 	});

// 	it('deve retornar um array vazio se chamadas estiver vazio', () => {
// 		const chamadas: any[] = [];
// 		const responses: any[] = [];

// 		const expectedOutput: any[] = [];

// 		const result = processCanonicoData(chamadas, responses);
// 		expect(result).toEqual(expectedOutput);
// 	});

// 	it('deve processar corretamente com chamadas e responses vazios', () => {
// 		const chamadas: any[] = [];
// 		const responses: any[] = [];

// 		const expectedOutput: any[] = [];

// 		const result = processCanonicoData(chamadas, responses);
// 		expect(result).toEqual(expectedOutput);
// 	});
// });
