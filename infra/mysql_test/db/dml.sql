USE VivoTest;

-- Inserir produtos
INSERT INTO Produtos (nome_produto, descricao, data_lancamento, status)
VALUES 
('Vivo Fibra 300MB', 'Plano de internet de alta velocidade para residências', '2024-01-01', 'Em Teste'),
('Vivo TV HD', 'Serviço de TV por assinatura com canais em alta definição', '2024-03-01', 'Em Teste'),
('Vivo Celular Ilimitado', 'Plano de celular com chamadas ilimitadas e dados móveis', '2024-02-15', 'Em Teste'),
('Vivo Fibra 500MB', 'Plano de internet ultra rápida para residências', '2024-05-01', 'Em Teste'),
('Vivo Internet Empresarial', 'Internet dedicada de alta velocidade para empresas', '2024-04-10', 'Em Teste');

-- Inserir clientes
INSERT INTO Clientes (nome_cliente, email_cliente, telefone_cliente, cidade, estado)
VALUES 
('João Silva', 'joao.silva@exemplo.com', '11987654321', 'São Paulo', 'SP'),
('Maria Oliveira', 'maria.oliveira@exemplo.com', '21987654321', 'Rio de Janeiro', 'RJ'),
('Carlos Pereira', 'carlos.pereira@exemplo.com', '31987654321', 'Belo Horizonte', 'MG'),
('Ana Souza', 'ana.souza@exemplo.com', '41987654321', 'Curitiba', 'PR'),
('Lucas Fernandes', 'lucas.fernandes@exemplo.com', '51987654321', 'Porto Alegre', 'RS');

-- Inserir associações entre clientes e produtos
INSERT INTO ClienteProduto (cliente_id, produto_id, data_associacao, feedback)
VALUES 
(1, 1, '2024-07-01', 'Internet muito rápida e estável'),
(2, 2, '2024-07-05', 'Qualidade de imagem excelente'),
(3, 3, '2024-07-10', 'Problemas de conexão frequentes'),
(4, 4, '2024-07-12', 'Velocidade excelente, sem quedas'),
(5, 5, '2024-07-15', 'Serviço empresarial confiável e estável'),
(1, 2, '2024-08-01', 'Gostei do serviço de TV HD'),
(2, 1, '2024-08-05', 'Internet rápida e eficiente'),
(3, 4, '2024-08-10', 'Plano de fibra muito bom'),
(4, 3, '2024-08-15', 'Serviço de celular com boa cobertura'),
(5, 1, '2024-08-20', 'Internet empresarial de qualidade');
