import random

product_types = ['MOBILE', 'INTERNET', 'IPTV', 'BUNDLE']
parent_products = []

with open('insert_products.sql', 'w', encoding='utf-8') as file:
    file.write("-- Inserção de dados fictícios para a tabela 'product'\n")
    
    # Inserir produtos pais primeiro (parent_id é NULL)
    for i in range(1, 506):  # Inserindo 505 produtos pais
        id = f'P{str(i).zfill(3)}'
        product_name = f'Produto {id}'
        product_type = random.choice(product_types)
        parent_id_value = 'NULL'
        line = f"INSERT INTO product (id, product_name, product_type, parent_id) VALUES ('{id}', '{product_name}', '{product_type}', {parent_id_value});\n"
        file.write(line)
        parent_products.append(id)
    
    # Inserir produtos filhos
    for i in range(506, 1006):  # Inserindo 500 produtos filhos
        id = f'P{str(i).zfill(3)}'
        product_name = f'Produto {id}'
        product_type = random.choice(product_types)
        parent_id = random.choice(parent_products)
        parent_id_value = f"'{parent_id}'"
        line = f"INSERT INTO product (id, product_name, product_type, parent_id) VALUES ('{id}', '{product_name}', '{product_type}', {parent_id_value});\n"
        file.write(line)
