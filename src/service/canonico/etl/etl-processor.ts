/**
 * Processa os dados recebidos e monta o canônico conforme os metadados.
 *
 * @param data - Dados de entrada.
 * @param responses - Respostas das chamadas aos serviços.
 * @returns Dados processados.
 */
export const processCanonicoData = (chamadas: any[], responses: any[]): any => {
	const dadoCanonico = [];

	for (const [index, chamada] of chamadas.entries()) {
		const response = responses[index];

		dadoCanonico.push({
			requestName: chamada.nome,
			response: response,
		});
	}

	return dadoCanonico;
};
