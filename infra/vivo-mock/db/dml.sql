USE VivoTest;

-- Inserir produtos
INSERT INTO product (product_name, description, release_date, product_type) VALUES
('Smartphone XYZ', 'Latest smartphone with advanced features', '2023-01-15', 'PHYSICAL'),
('Laptop ABC', 'High-performance laptop for professionals', '2022-11-01', 'PHYSICAL'),
('Headphones DEF', 'Noise-canceling wireless headphones', '2022-07-21', 'PHYSICAL'),
('Cloud Storage Plan', '1TB cloud storage subscription', '2023-05-10', 'DIGITAL'),
('E-book Reader', 'Lightweight e-book reader with backlight', '2021-10-02', 'PHYSICAL'),
('Music Streaming Subscription', 'Unlimited music streaming', '2023-02-22', 'DIGITAL'),
('Software Suite', 'Office productivity software', '2023-03-05', 'DIGITAL'),
('Smartwatch GHI', 'Smartwatch with health tracking features', '2022-09-17', 'PHYSICAL'),
('Online Course Subscription', 'Access to a variety of online courses', '2023-06-30', 'DIGITAL'),
('Fitness Tracker', 'Wearable fitness tracking device', '2022-12-10', 'PHYSICAL');

-- Inserir clientes
INSERT INTO client (customer_name, customer_email, customer_phone, city, state) VALUES
('Alexandre Souza', 'alexandre.souza@email.com', '555-1234', 'São Paulo', 'SP'),
('Maria Silva', 'maria.silva@email.com', '555-5678', 'Rio de Janeiro', 'RJ'),
('Carlos Oliveira', 'carlos.oliveira@email.com', '555-8765', 'Curitiba', 'PR'),
('Fernanda Costa', 'fernanda.costa@email.com', '555-3456', 'Belo Horizonte', 'MG'),
('Paulo Mendes', 'paulo.mendes@email.com', '555-4321', 'Porto Alegre', 'RS'),
('Joana Santos', 'joana.santos@email.com', '555-9876', 'Fortaleza', 'CE'),
('Ricardo Lima', 'ricardo.lima@email.com', '555-6543', 'Salvador', 'BA'),
('Gabriela Araújo', 'gabriela.araujo@email.com', '555-7654', 'Recife', 'PE'),
('Pedro Alves', 'pedro.alves@email.com', '555-8767', 'Brasília', 'DF'),
('Juliana Cardoso', 'juliana.cardoso@email.com', '555-5432', 'Florianópolis', 'SC');

-- Inserir associações entre clientes e produtos
INSERT INTO customerproduct (customer_id, product_id, association_date, feedback, status, price) VALUES
(1, 1, '2023-06-01', 'Very satisfied with the product', 'ACTIVE', 999.99),
(2, 2, '2023-06-10', 'Good performance, no issues', 'ACTIVE', 1500.00),
(3, 3, '2023-06-15', 'Sound quality is amazing', 'ACTIVE', 250.00),
(4, 4, '2023-07-01', 'Easy to use, great value', 'ACTIVE', 120.00),
(5, 5, '2023-07-10', 'Perfect for reading on the go', 'INACTIVE', 89.99),
(6, 6, '2023-07-20', 'Great music selection', 'ACTIVE', 10.00),
(7, 7, '2023-08-01', 'Very useful for work', 'INACTIVE', 199.99),
(8, 8, '2023-08-05', 'Health tracking is excellent', 'ACTIVE', 300.00),
(9, 9, '2023-08-10', 'Wide range of courses available', 'INACTIVE', 59.99),
(10, 10, '2023-08-15', 'Helps track fitness goals effectively', 'ACTIVE', 150.00);

