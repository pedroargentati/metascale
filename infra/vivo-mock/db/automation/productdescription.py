import random

categories = ['DATES', 'GENERAL', 'PROMOTION']

with open('insert_productdescription.sql', 'w', encoding='utf-8') as file:
    file.write("-- Inserção de dados fictícios para a tabela 'productdescription'\n")
    
    product_ids = [f'P{str(i).zfill(3)}' for i in range(1, 1006)]
    
    for product_id in product_ids:
        description_text = f'Descrição do {product_id}'
        url = f'http://example.com/produto/{product_id}'
        category = random.choice(categories)
        line = f"INSERT INTO productdescription (id, text, url, category) VALUES ('{product_id}', '{description_text}', '{url}', '{category}');\n"
        file.write(line)
