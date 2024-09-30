import random
from datetime import datetime, timedelta

status_list = ['ACTIVATING', 'ACTIVE', 'CANCELLED', 'INACTIVE', 'SUSPENDED']

with open('insert_userproduct.sql', 'w', encoding='utf-8') as file:
    file.write("-- Inserção de dados fictícios para a tabela 'userproduct'\n")
    
    user_ids = [str(i) for i in range(1, 1005)]
    product_ids = [f'P{str(i).zfill(3)}' for i in range(1, 1006)]
    entries_set = set()
    
    for _ in range(2000):
        product_id = random.choice(product_ids)
        user_id = random.choice(user_ids)
        key = (product_id, user_id)
        if key in entries_set:
            continue  # Evita duplicatas
        entries_set.add(key)
        value = round(random.uniform(10.0, 500.0), 2)
        start_date = datetime.now() - timedelta(days=random.randint(0, 1000))
        end_date = start_date + timedelta(days=random.randint(30, 365))
        description = f'Assinatura do produto {product_id} pelo usuário {user_id}'
        recurring_period = f'{random.randint(1, 12)} meses'
        type_value = random.choice(['Standard', 'Premium', 'Basic'])
        status = random.choice(status_list)
        
        line = (
            f"INSERT INTO userproduct (product_id, user_id, value, end_date, start_date, description, "
            f"recurring_period, type, status) VALUES ('{product_id}', '{user_id}', {value}, "
            f"'{end_date.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}', "
            f"'{start_date.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}', "
            f"'{description}', '{recurring_period}', '{type_value}', '{status}');\n"
        )
        file.write(line)
