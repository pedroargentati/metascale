<h1 align='center'>
Metascale - Cicada
</h1>
<p align="center">
  <a href="" rel="noopener">
 <img width=350px height=200px src="https://i.imgur.com/oXHVMKJ.png" alt="Project logo"></a>
</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## 📝 Índice

- [Arquitetura](#arquitetura)
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

## 🧐 Arquitetura [🔝](#arquitetura)

### Metascale
O nome da nossa solução, Metascale, origina da ideia de metadados e escalabilidade, em que nos baseamos nesses metadados para associar os retornos dos diferentes sistemas heterogêneos da Vivo, com um modelo canônico homogeneizado.

De forma que a partir desse modelo canônico, conseguimos salvar as informações para um retorno performático e escalável através de soluções Cloud da AWS, como a Lambda e o DynamoDB, em que JSON’s “prontos” preparados a partir do canônico são registrados no Dynamo, e o Lambda, por ser uma solução serverless, trataria as necessidades de performance e escalabilidade automaticamente, respondendo aos picos conforme a necessidade.

Entrando em detalhes no que chamamos de metadados, um exemplo de uso seria associar o atributo “description” do JSON retornado no serviço XYZ da Vivo, com o atributo “descrição” do modelo canônico “Produto”. A vantagem dessa abordagem está na facilidade de associação de novos serviços com a solução, e suas evoluções, tendo em vista que em outro serviço de produto, o nome do atributo correspondente à “descrição” do canônico, poderia ter o nome “desc”. Da mesma forma, caso surja a necessidade de usar algum outro atributo, bastaria alterar o metadado da solução e funcionaria sem nenhum problema, o que não seria possível ao acoplar os retornos de ambos serviços à solução.

Assim como comentado na apresentação do desafio, a palavra-chave estaria em “Desacoplamento”, e foi o que buscamos com o Metascale.

<div align="center">
	<img src="https://github.com/user-attachments/assets/f2fbe165-ae00-4f9f-8d4a-3af846e3d4eb" />
</div>

##

### Funcionamento da Solução

Abaixo, destacamos três cenários que percorrem a arquitetura da solução toda, explicando o que aconteceria em cada caso:


### CARREGAMENTO E PROCESSAMENTO INICIAL NO DYNAMODB
Quando a informação solicitada pelo cliente no App Vivo já está carregada e pronta no DynamoDB, o componente denominado Metascale já teria processado as informações dos produtos do cliente através de um processo ETL, em que requisições GET seriam disparadas aos sistemas Vivo para obter todos os dados necessários previamente, associando e tratando devidamente as informações usando os metadados e montando o modelo canônico correspondente.

Para isso ter ocorrido, o processo terá sido disparado pela API.

A API é capaz de aceitar requisições de busca de informações ainda não carregadas ou defasadas do DynamoDB, disparando o processo de ETL conforme as requisições. Sendo útil para cenários mais específicos ou pontuais em que o carregamento necessite ocorrer.

## Requisitos [🔝](#requisitos)

- Node.js (versão 14 ou superior)
- npm (ou yarn)
- Docker Desktop

## 🎈 Instalação [🔝](#instalação)

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
### 4. Configurar variáveis de ambiente

Crie o arquivo `.env` seguindo o template abaixo:
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

### 5. Modos de Inicialização da Aplicação

#### API

- Um servidor Express será inicializado na porta configurada nas variáveis de ambiente (caso esteja configurada), ou, por padrão, na porta `8080`.
- Todas as chamadas à API estarão disponíveis após a inicialização. Para mais detalhes sobre os endpoints e funcionalidades, acesse a [Documentação da API](http://localhost:8080/api-docs/#/).

#### Kafka

- Ao ser inicializada, a aplicação busca todos os canônicos cadastrados no DynamoDB. Para cada tópico associado ao respectivo canônico, a aplicação irá se inscrever nesses tópicos e consumir todas as mensagens disponíveis.
- Após consumir as mensagens, a aplicação dispara o método `synchronize` do projeto **canonical-builder**, que é responsável por sincronizar as informações consumidas.
- **Atenção**: Certifique-se de que o servidor Kafka está em execução corretamente e que as configurações no arquivo `.env` estão corretas.

## 6. Rodar o Projeto

Para iniciar o projeto, siga os passos abaixo:

1. **Entrar na Pasta de Infraestrutura**
```bash
cd infra
```
2. **Dentro da pasta infra, navegue até a pasta `local`:**
```bash
cd local
```
3. **Execute o script `setup.bat` para configurar e iniciar as imagens Docker necessárias:**
```bash
setup.bat
```
Certifique-se de que você tenha o Docker instalado e configurado corretamente em sua máquina antes de executar o script.


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

## ✍️ Autores

<div align="center">

| **Gabriel Kazuki**                                                                                             |
|:-------------------------------------------------------------------------------------------------------------:|
| Desenvolvedor Full-Stack responsável pela arquitetura e desenvolvimento do MetaScale.                          |
| [GitHub](https://github.com/GKazukiOnishi) • [LinkedIn](https://www.linkedin.com/in/gabriel-onishi)            |

| **Pedro Argentati**                                                                                            |
|:-------------------------------------------------------------------------------------------------------------:|
| Desenvolvedor Full-Stack responsável pelo desenvolvimento do MetaScale.                                        |
| [GitHub](https://github.com/pedroargentati) • [LinkedIn](https://www.linkedin.com/in/pedro-argentati)          |

| **Breno de Souza**                                                                                             |
|:-------------------------------------------------------------------------------------------------------------:|
| Analista de dados responsável pelo desenvolvimento de análises e métricas utilizando Grafana.                 |
| [GitHub](https://github.com/breno-souza) • [LinkedIn](https://www.linkedin.com/in/breno-souza)                 |

| **Rafael Tannous**                                                                                             |
|:-------------------------------------------------------------------------------------------------------------:|
| Analista de dados responsável pelo desenvolvimento de análises e métricas utilizando Grafana.                 |
| [GitHub](https://github.com/rafaeltannous) • [LinkedIn](https://www.linkedin.com/in/rafael-tannous)            |

| **Felipe Otto**                                                                                                |
|:-------------------------------------------------------------------------------------------------------------:|
| Analista de Redes responsável pela configuração da VPC, EC2 e Load Balancer na AWS.                            |
| [GitHub](https://github.com/felipe-otto) • [LinkedIn](https://www.linkedin.com/in/felipe-otto)                 |

</div>


