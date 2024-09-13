<h1 align='center'>
Metascale - Cicada
</h1>

![metascale-logo](https://github.com/user-attachments/assets/1e16633c-0723-416b-8552-0e4e93fb30be)

</div>

## Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Tecnologias Utilizadas](#techs)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Capturas de Tela](#capturas-de-tela)
- [Contribuição](#contribuição)
- [Autores](#autores)
- [Licença](#licença)
- [Agradecimentos](#agradecimentos)

## Requisitos [🔝](#requisitos)

- Node.js (versão 14 ou superior)
- npm (ou yarn)

## Instalação [🔝](#instalação)

### 1. Clonar o repositório

Execute o comando abaixo no terminal para clonar o repositório:

```bash
git clone https://github.com/pedroargentati/metascale.git
```

### 2. Acessar o diretório do projeto

Navegue até o diretório do projeto clonado:

```bash
cd metascale
```

### 3. Instalar as dependências

```bash
npm install
```
ou
```bash
yarn install
```
### 4. Configurar variáveis de ambient

Crie o arquivo .env seguindo o template abaixo:
```env
PORT={API_PORT}

AWS_ACCESS_KEY_ID={ACCESS_KEY}
AWS_SECRET_ACCESS_KEY={SECRET_KEY}
AWS_REGION=us-east-2

KAFKA_CLIENT_ID=metascale
KAFKA_BROKERS={host-kafka}:{port-kafka}
KAFKA_GROUP_ID=metascale-group

KAFKAJS_NO_PARTITIONER_WARNING=1

INSTANCE_TYPE={API ou KAFKA}

DEV_MODE=true
```

### 5. Compilar o código TypeScript

Antes de rodar o projeto, é necessário compilar o código TypeScript:

```bash
npm run build
```
ou
```bash
yarn build
```

### 6. Rodar o projeto

```bash
npm start
```
ou
```bash
yarn start
```

## Tecnologias Utilizadas
<div align="center">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" />
<img src="https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white" />
<img src="https://img.shields.io/badge/Grafana-F2F4F9?style=for-the-badge&logo=grafana&logoColor=orange&labelColor=F2F4F9" />
<img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" />

</div>
