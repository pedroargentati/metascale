export const getCanonicoBanco = async (): Promise<any> => {
	return {
		id: 1,
		nome: 'clienteProduto',
		descricao: 'Produtos do Cliente',
		chamadas: [
			{
				ordem: 1,
				nome: 'getClienteProduto',
				url: 'localhost/users/{id}/products',
				descricao: 'Retorna os produtos do cliente',
				parametros: [
					{
						nome: 'id',
						tipo: 'path',
						tipoDado: 'number',
					},
					{
						nome: 'name',
						tipo: 'query',
						tipoDado: 'string',
					},
				],
			},
		],
	};
};
