/**
 * Processa os dados recebidos e monta o canônico conforme os metadados.
 *
 * @param data - Dados de entrada.
 * @param responses - Respostas das chamadas aos serviços.
 * @returns Dados processados.
 */
export const processCanonicoData = (data: any, responses: any[]): any => {
	const canonicData = { ...data, canonicFields: {} };

	for (const response of responses) {
	}

	return canonicData;
};

/**
 * Processa campos aninhados conforme os metadados.
 *
 * @param result - Resultado da chamada ao serviço.
 * @param subFields - Campos aninhados para processamento.
 * @returns Dados processados.
 */
export const processSubFields = (result: any, subFields: any[]): any[] => {
	return subFields.map((subField) => {
		const processedSubField: any = {};
		return processedSubField;
	});
};
