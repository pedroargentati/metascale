CREATE DATABASE IF NOT EXISTS VivoTest;

USE VivoTest;

-- Tabela de Produtos/Serviços
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    product_type ENUM('MOBILE', 'LANDLINE', 'INTERNET', 'IPTV', 'BUNDLE', 'VALUE_ADDED_SERVICE') NOT NULL  -- Enum para o tipo de produto ajustado
);

-- Tabela de Clientes
CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(50)
);

-- Tabela de Associação entre Clientes e Produtos (Relacionamento)
CREATE TABLE customerproduct (
    customer_product_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    association_date DATE,
    feedback VARCHAR(255),
    price DECIMAL(10, 2),
    status ENUM('ACTIVE', 'ACTIVATING', 'SUSPENDED', 'CANCELLED', 'INACTIVE') NOT NULL,  -- Enum ajustado para o status

    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);
