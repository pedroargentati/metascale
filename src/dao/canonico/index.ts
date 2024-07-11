export const getCanonicoBanco = async (id: number): Promise<any> => {
	return {
		id: 1,
		nome: 'ClienteProduto',
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
				estrutura: [
					{
						id: { tipo: 'number', dadoCanonico: 'id' },
						status: 'active',
						product_name: 'Vivo Total 700 Mega + Netflix',
						product_type: 'bundle',
						identifiers: ['+51939791073'],
						start_date: '2024-03-14T23:00:00+01:00',
						subscription_type: 'prepaid',
						descriptions: [
							{
								text: 'pré pago turbo',
							},
						],
						sub_products: [
							{
								id: '24523asfgaswtrwetr',
								status: 'active',
								product_name: 'Vivo pós 20GB',
								identifiers: ['+51939791073'],
								product_type: 'mobile',
								start_date: '2024-03-14T23:00:00+01:00',
								descriptions: [
									{
										text: 'Linha móvel com 20GB de franquia',
									},
								],
							},
						],
					},
				],
			},
		],
	};
};
