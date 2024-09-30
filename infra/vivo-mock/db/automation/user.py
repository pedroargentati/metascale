import random

# Lists of sample first names and last names
first_names = [
    'Alex', 'Mariana', 'Carlos', 'Joana', 'Pedro',
    'Ana', 'Luiz', 'Fernanda', 'Gustavo', 'Camila',
    'Lucas', 'Bruna', 'Felipe', 'Juliana', 'Rafael',
    'Letícia', 'Ricardo', 'Sofia', 'Daniel', 'Isabela'
]

last_names = [
    'Silva', 'Souza', 'Pereira', 'Mendes', 'Santos',
    'Costa', 'Oliveira', 'Almeida', 'Ferreira', 'Rodrigues',
    'Gomes', 'Martins', 'Barbosa', 'Araújo', 'Ribeiro',
    'Lima', 'Carvalho', 'Rocha', 'Dias', 'Moreira'
]

# List of city and state pairs
cities_states = [
    ('São Paulo', 'SP'),
    ('Rio de Janeiro', 'RJ'),
    ('Belo Horizonte', 'MG'),
    ('Curitiba', 'PR'),
    ('Fortaleza', 'CE'),
    ('Salvador', 'BA'),
    ('Manaus', 'AM'),
    ('Porto Alegre', 'RS'),
    ('Recife', 'PE'),
    ('Brasília', 'DF'),
    ('Belém', 'PA'),
    ('Goiânia', 'GO'),
    ('Maceió', 'AL'),
    ('Natal', 'RN'),
    ('Florianópolis', 'SC'),
    ('Vitória', 'ES'),
    ('João Pessoa', 'PB'),
    ('Cuiabá', 'MT'),
    ('Aracaju', 'SE'),
    ('Campo Grande', 'MS')
]

with open('insert_users.sql', 'w', encoding='utf-8') as file:
    file.write("-- Inserção de dados fictícios para a tabela 'users'\n")
    
    for i in range(1, 1005):  # IDs from 1 to 1004
        id = str(i)
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        name = f'{first_name} {last_name}'
        email = f'{first_name.lower()}.{last_name.lower()}{id}@example.com'
        phone = f'+55{random.randint(1000000000, 9999999999)}'
        city, state = random.choice(cities_states)
        line = f"INSERT INTO users (id, name, email, phone, city, state) VALUES ('{id}', '{name}', '{email}', '{phone}', '{city}', '{state}');\n"
        file.write(line)
