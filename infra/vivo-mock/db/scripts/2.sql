USE VivoTest;

INSERT INTO users (id, name, email, phone, city, state) VALUES
('1', 'Alex Silva', 'alex.silva@example.com', '+51939791073', 'São Paulo', 'SP'),
('2', 'Mariana Souza', 'mariana.souza@example.com', '+51939791074', 'Rio de Janeiro', 'RJ'),
('3', 'Carlos Pereira', 'carlos.pereira@example.com', '+51939791075', 'Belo Horizonte', 'MG'),
('4', 'Joana Mendes', 'joana.mendes@example.com', '+51939791076', 'Curitiba', 'PR'); -- Joana não tem produtos associados

-- Inserção de dados fictícios para a tabela 'productdescription' com id igual ao id de 'product'
INSERT INTO productdescription (id, text, url, category) VALUES
('P001', 'Descrição do Produto A - versão básica', 'http://example.com/produtoA/basico', 'GENERAL'),
('P002', 'Descrição do Produto B - Internet rápida', 'http://example.com/produtoB', 'DATES'),
('P003', 'Descrição do Produto C - Pacote completo', 'http://example.com/produtoC', 'PROMOTION'),
('P004', 'Descrição do Produto D - IPTV', 'http://example.com/produtoD', 'GENERAL'),
('P005', 'Descrição do Produto E - Serviço móvel', 'http://example.com/produtoE', 'GENERAL');

-- Inserção de dados fictícios para a tabela 'product'
INSERT INTO product (id, product_name, product_type, parent_id) VALUES
('P001', 'Produto A', 'MOBILE', NULL),
('P002', 'Produto B', 'INTERNET', 'P001'),
('P003', 'Produto C', 'BUNDLE', NULL),
('P004', 'Produto D', 'IPTV', 'P003'),
('P005', 'Produto E', 'MOBILE', NULL); -- Novo produto, sem pai e sem associação direta

-- Inserção de dados fictícios para a tabela 'userproduct' com múltiplos produtos por usuário e diferentes statuses
INSERT INTO userproduct (user_id, product_id, start_date, end_date, description, type, recurring_period, value, status) VALUES
('1', 'P001', '2024-01-01', '2024-12-31', 'Assinatura do Produto A', 'RECURRING', 'ANNUAL', 299.99, 'ACTIVE'),
('2', 'P004', '2024-04-15', '2024-10-15', 'Assinatura do Produto D', 'RECURRING', 'MONTHLY', 59.99, 'SUSPENDED'),
('3', 'P003', '2023-05-05', '2024-05-04', 'Serviço do Produto C', 'RECURRING', 'MONTHLY', 19.99, 'ACTIVE'),
('3', 'P001', '2023-05-07', '2024-05-10', 'Assinatura do Produto A', 'RECURRING', 'ANNUAL', 299.99, 'ACTIVE');
