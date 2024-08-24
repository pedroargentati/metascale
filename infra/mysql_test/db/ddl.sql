CREATE DATABASE IF NOT EXISTS VivoTest;

USE VivoTest;

-- Tabela de Produtos/Serviços
CREATE TABLE IF NOT EXISTS Produtos (
    produto_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_lancamento DATE,
    status VARCHAR(50) DEFAULT 'Em Teste'
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS Clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) UNIQUE NOT NULL,
    telefone_cliente VARCHAR(20),
    cidade VARCHAR(50),
    estado VARCHAR(50)
);

-- Tabela de Associação entre Clientes e Produtos (Relacionamento)
CREATE TABLE IF NOT EXISTS ClienteProduto (
    cliente_produto_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    produto_id INT,
    data_associacao DATE NOT NULL,
    feedback TEXT,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    FOREIGN KEY (produto_id) REFERENCES Produtos(produto_id)
);
