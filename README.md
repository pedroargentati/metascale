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

- [🧐 Arquitetura](#-arquitetura)
  - [Metascale](#metascale)
  - [Funcionamento da Solução](#funcionamento-da-solução)
  - [Carregamento e Processamento Inicial no DynamoDB](#carregamento-e-processamento-inicial-no-dynamodb)
  - [Fall-Back do Lambda](#fall-back-do-lambda)
  - [Garantindo a Sincronização Automática do DynamoDB](#garantindo-a-sincronização-automática-do-dynamodb)
  - [Captura de Alterações (CDC) com Debezium e Kafka](#captura-de-alterações-cdc-com-debezium-e-kafka)
    - [1. Captura de Alterações (CDC) com Debezium](#1-captura-de-alterações-cdc-com-debezium)
    - [2. Publicação de Eventos no Kafka](#2-publicação-de-eventos-no-kafka)
    - [3. Processamento dos Dados pelo Metascale](#3-processamento-dos-dados-pelo-metascale)
    - [4. Envio dos Dados ao DynamoDB](#4-envio-dos-dados-ao-dynamodb)
  - [Falta de Informação no DynamoDB](#falta-de-informação-no-dynamodb)
  - [Gerenciamento de Atualizações e Concorrência](#gerenciamento-de-atualizações-e-concorrência)
  - [Regras e Restrições](#regras-e-restrições)
  - [Resumo](#resumo)
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
O nome da nossa solução, **Metascale**, origina da ideia de **metadados e escalabilidade**, em que nos baseamos nesses metadados para associar os retornos dos diferentes sistemas heterogêneos da Vivo, com um modelo canônico homogeneizado.

De forma que a partir desse modelo canônico, conseguimos salvar as informações para um retorno performático e escalável através de soluções **Cloud da AWS**, como o *Lambda* e o *DynamoDB*, em que *JSON’s “prontos”* preparados a partir do canônico são registrados no Dynamo, e o Lambda, por ser uma solução serverless, trataria as necessidades de performance e escalabilidade automaticamente, respondendo aos picos conforme a necessidade.

Entrando em detalhes no que chamamos de metadados, um exemplo de uso seria associar o atributo *“description”* do JSON retornado no serviço XYZ da Vivo, com o atributo *“descrição”* do modelo canônico *“Produto”*. A vantagem dessa abordagem está na facilidade de associação de novos serviços com a solução, e suas evoluções, tendo em vista que em outro serviço de produto, o nome do atributo correspondente à *“descrição”* do canônico, poderia ter o nome *“desc”*. Da mesma forma, caso surja a necessidade de usar algum outro atributo, bastaria alterar o metadado da solução e funcionaria sem nenhum problema, o que não seria possível ao acoplar os retornos de ambos serviços à solução.

Assim como comentado na apresentação do desafio, a palavra-chave estaria em *“Desacoplamento”*, e foi o que buscamos com o **Metascale**.

<h3 align="center">Desenho da solução</h3>

<div align="center">
	<img src="https://github.com/user-attachments/assets/772788f2-d145-4359-ab7a-aab94447d9ff" />
</div>

### Funcionamento da Solução

### Carragamento e Processamento Inicial no DynamoDB

Quando a informação solicitada pelo cliente no **App Vivo** já está carregada e pronta no **DynamoDB**, o componente denominado **Metascale** já teria processado as informações dos produtos do cliente através de um processo de **ETL**. Nesse processo, requisições *GET* são disparadas para os sistemas da Vivo com o objetivo de obter todos os dados necessários previamente, associando e tratando as informações utilizando os metadados e montando o modelo canônico correspondente.

### Fall-Back do Lambda

Entretanto, caso a informação não esteja disponível no **DynamoDB**, o Lambda possui um mecanismo de *fall-back*. Nesse cenário, o Lambda chama a API do Metascale (este projeto) para realizar todo o processo de ETL. A API é responsável por buscar o modelo canônico correspondente, recuperar as informações nas aplicações *blackbox* da Vivo e montar o resultado para exibição ao cliente.

Antes que a informação fique pronta, pode ser necessário realizar alguns tratamentos específicos no *payload*. Para esses casos, criamos outra aplicação, disponível no [repositório Metascale Builder](https://github.com/pedroargentati/metascale-builder), que permite que os próprios desenvolvedores da Vivo possam:

- **Modificar e realizar pós-processamento no payload:** Utilizando o método `build`, os desenvolvedores podem realizar qualquer tipo de modificação no *payload*.
- **Extrair dados dos parâmetros necessários:** Com o método `extract`, é possível extrair os dados necessários diretamente do *payload*.
- **Realizar o *merge* de canônicos:** O método `merge` permite juntar *n* canônicos, da forma que o desenvolvedor preferir.

Essa arquitetura garante que as informações sejam corretamente tratadas e apresentadas ao cliente, independentemente de estarem disponíveis diretamente no **DynamoDB** ou exigirem o processamento adicional do **Metascale**.

A partir desse disparador, conseguimos ter a garantia de que a informação do **DynamoDB** sempre estará atualizada e pronta para retorno ao cliente. De forma que no cenário atual, **apenas seria necessário retornar um JSON ou montar a informação a partir de outros JSON(s) já carregado(s)** da informação desejada ao App Vivo para visualização do cliente, através das funções Lambda da *AWS* acessando o **DynamoDB** diretamente.

### Garantindo a Sincronização automática do DynamoDB

No cenário em que o cliente alterou alguma informação relacionada aos seus produtos, o App da Vivo teria se comunicado diretamente com seus sistemas para requisições de atualização, contornando a nossa solução. Todavia caso o cliente esteja contratando um novo produto, por exemplo, a nossa solução deveria ser capaz de retornar a informação atualizada após a finalização da requisição de atualização, de forma que não bastaria aguardar uma atualização do DynamoDB sem que nenhum sistema avisasse a nossa solução.

## Captura de Alterações (CDC) com Debezium e Kafka

1. **Captura de Alterações (CDC) com Debezium**:
   - O **Debezium** é um componente de captura de mudanças (*Change Data Capture* - CDC) que monitora os bancos de dados dos sistemas da Vivo. Ele é responsável por detectar alterações (inserções, atualizações e exclusões) em tempo real.
   - Sempre que ocorre uma mudança nos sistemas Vivo (representados como *black-box*), o **Debezium** extrai essas informações e transforma as mudanças em eventos de dados.
   - Caso o cliente esteja contratando um novo produto, por exemplo, a nossa solução será capaz de retornar a informação atualizada após a finalização da requisição de atualização, de forma que não bastaria aguardar uma atualização do **DynamoDB** sem que nenhum sistema avisasse a nossa solução.

2. **Publicação de Eventos no Kafka**:
   - Após a captura das mudanças, o **Debezium** publica esses eventos em tópicos do **Kafka**, que está conectado ao componente **Metascale**. O **Kafka** funciona como um sistema de mensageria distribuído, permitindo o gerenciamento eficiente de grandes volumes de dados em tempo real.
   - Esses eventos publicados no **Kafka** representam os dados que precisam ser processados pelo próximo componente na arquitetura.

3. **Processamento dos Dados pelo Metascale**:
   - O **Kafka**, ao receber os eventos do **Debezium**, dispara as mensagens para a aplicação **Metascale**. O **Metascale** é responsável por processar os dados recebidos, realizando as transformações necessárias no contexto de um processo **ETL** (Extract, Transform, Load).
   - O **Metascale** trata os dados, aplicando a lógica de negócio, e os prepara em um formato canônico que será posteriormente consumido pelo sistema final.

4. **Envio dos Dados ao DynamoDB**:
   - Após o processamento dos dados pelo **Metascale**, o resultado é enviado para o banco de dados **DynamoDB**. Esse banco de dados armazena os dados transformados de forma eficiente e otimizada para consultas futuras.
   - Sempre que o **App Vivo** fizer uma solicitação de informações, o **Lambda** irá consultar o **DynamoDB** para buscar as informações já processadas. Caso os dados não estejam disponíveis, o **Lambda** acionará o **Metascale** novamente para buscar as informações e realizar o ETL.

Com isso, a Vivo seria capaz de avisar a nossa solução sem a necessidade de alteração em seu código fonte, apenas configurando essa estrutura conforme a necessidade. Garantindo assim que, de forma assíncrona, os dados atualizados dos clientes da Vivo sejam carregados novamente no **DynamoDB** com a performance e a latência necessária, através do processamento do **Debezium** e do andamento da mensageria **Kafka**.

## Merge dos Canônicos

O processo de **merge** (fusão) dos canônicos é essencial quando os dados do modelo canônico são compostos por informações que vêm de múltiplas fontes ou "dimensões". Essas dimensões podem representar diferentes tabelas ou sistemas, como uma tabela de produtos e uma tabela de planos de pagamento, por exemplo.

### Cenário

Suponha que tanto a tabela de produtos quanto a de planos de pagamento possuam um atributo em comum, como o campo `description`. Em vez de atualizar manualmente todas as ocorrências desse atributo em cada dimensão de forma separada, o método **merge** no componente `canonical-builder` facilita a integração dessas informações de forma unificada.

### Como Funciona

Quando o **merge** é executado:

1. **Busca e Integração de Dados**: O método realiza uma busca em todas as dimensões que compartilham o mesmo atributo (por exemplo, o campo `description`).
   
2. **Unificação**: Ele consolida esses dados em uma única resposta, retornando a informação unificada e atualizada. Isso evita redundâncias e inconsistências, garantindo que a informação apresentada seja coerente e completa, considerando todas as fontes de dados.

3. **Otimização**: Em vez de realizar múltiplas consultas ou atualizações em cada sistema ou tabela separadamente, o **merge** simplifica esse processo ao permitir uma única chamada que agrega as informações de todas as dimensões relevantes.

### Vantagens do Merge

- **Eficiência**: O processo de fusão automatiza a busca e atualização dos dados, economizando tempo e reduzindo a complexidade do código.
  
- **Coerência dos Dados**: Ao consolidar as informações de diferentes fontes, o método garante que os dados sejam coerentes, eliminando o risco de inconsistências entre sistemas.
  
- **Escalabilidade**: Conforme o número de fontes e dimensões aumenta, o método **merge** continua a fornecer uma solução escalável, permitindo a fusão eficiente de dados sem a necessidade de atualizações manuais.

### Exemplo de Uso

Vamos considerar um exemplo prático:

- O canônico contém informações sobre produtos e planos de pagamento.
- Tanto o produto quanto o plano de pagamento têm o atributo `description`.
  
Usando o método **merge**, você pode unificar a `description` de ambas as dimensões em uma única resposta, garantindo que os dados corretos de ambas as fontes sejam retornados de maneira integrada.


## Falta de Informação no DynamoDB

No cenário em que a informação solicitada ainda não está carregada no **DynamoDB**, pois o processo não priorizou o seu carregamento previamente, surge o pior cenário da solução. Nele, por motivos inesperados, algum cliente que não tenha sido priorizado tenta acessar o **App Vivo**, necessitando aguardar que o **Metascale** realize o carregamento da informação completa nos sistemas da Vivo.

Nesse caso, o tempo de espera seria semelhante ao anterior à solução, acrescido do tempo necessário para o processo de ETL do **Metascale**, que pode ou não ser capaz de otimizar a busca de informações. Isso dependerá se determinadas buscas nos sistemas da Vivo envolvem informações não diretamente ligadas ao novo cliente, mas a outros dados, como informações relacionadas a produtos sem associação direta a um cliente específico.

Esperamos que esse cenário não ocorra com frequência. No entanto, caso ocorra, a expectativa é que apenas esse primeiro carregamento seja demorado, não apresentando problemas de latência após a primeira carga ser realizada no **DynamoDB**.

## Gerenciamento de Atualizações e Concorrência

Nesses casos, o que ocorre é que, enquanto o **Metascale** não tenha recebido o aviso originário do **Debezium**, ele retornará a informação ainda localizada no **DynamoDB**. No entanto, assim que o **Metascale** consome o "tópico" da fila do **Kafka**, indicando uma atualização de informação, ele invalidará o registro do **DynamoDB**, disparando um processo eficiente de atualização apenas das informações alteradas, até que o registro esteja coerente com a informação mais atual.

Esse comportamento pode ser associado com uma transação de banco de dados, em que enquanto o "commit" final dos sistemas da Vivo não tenha acontecido, a informação anterior será retornada. Após o "commit", ela seria atualizada e retornada com as informações novas. Apesar do risco de um retorno parcial das informações mais recentes, a arquitetura atual da Vivo, que trabalha com microsserviços, já considera o assincronismo como uma consequência, dado que depende de diversos bancos de dados para a mesma informação.

Para mitigar esses casos, uma possibilidade seria investigar mais a fundo os logs analisados pelo **Debezium**, utilizando flags estratégicas para indicar alterações de informação e garantir que a atualização ocorra antes de qualquer retorno. Outra abordagem seria a implementação de **Webhooks** como alternativa para disparar eventos que notificam a finalização da alteração.

## Regras e Restrições

- Dependência do funcionamento da AWS.
- Dependência com os sistemas da Vivo para carregamento de informações.
- Necessidade de implementar o Debezium corretamente para os avisos de CDC, configurando as conexões com as bases de dados da Vivo.
- Necessidade de configurar os metadados corretamente para sincronizar os sistemas com o Metascale.
- Se houver a necessidade de adicionar algum tipo de tratamento personalizado ao modelo canônico a ser montado, será necessário configurar os serviços de customização adequadamente.

## Resumo

Esse fluxo garante que as alterações nos dados dos sistemas da Vivo sejam capturadas em tempo real pelo **Debezium**, publicadas no **Kafka** e processadas pelo **Metascale**, que depois armazena o resultado no **DynamoDB** para ser consumido de forma otimizada pelo **App Vivo**. O sistema é altamente escalável e responsivo, garantindo a integridade e disponibilidade dos dados para os clientes da Vivo.

## Requisitos Funcionais e Não Funcionais

| N°    | Requisito                                                     | Descrição                                                                                     | Status    |
|-------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------|-----------|
| RF01  | Buscar informações no sistema da Vivo                         | Habilita a busca de informações nos sistemas Vivo.                                               | ✔️        |
| RF02  | Atualizar informações conforme sistemas da Vivo               | O Metascale mantém a coerência dos dados à medida que os sistemas da Vivo os atualizam.          | ✔️        |
| RF03  | Carregar lote de dados                                        | O Metascale carrega em lotes as informações dos sistemas da Vivo.                                | ✔️        |
| RF04  | Atualizar metadados                                           | O sistema recebe atualizações nos metadados para manter a comunicação precisa entre os sistemas. | ✔️        |
| RF05  | Personalizar informações com regras de negócio e tratamentos  | É possível adicionar tratamentos personalizados aos dados salvos no Metascale.                  | ✔️        |
| RF06  | Monitorar o funcionamento da solução                          | Acesso a funções de monitoramento e observabilidade é essencial para a solução.                  | ✔️        |
| RF07  | Corrigir informações dos clientes no Metascale                | Possibilitar manutenções nos dados do Metascale.                                                 | ✔️        |
| RF08  | Avisos e alertas de situações atípicas do sistema             | Implementar avisos e alertas em situações atípicas, como picos de chamadas.                      | ✔️        |
| RNF01 | Gestão de Dados Canônicos                                     | Integração de dados de fontes legadas, garantindo homogeneização e padronização.                 | ✔️        |
| RNF02 | Desempenho de Pico                                             | Mantém alta disponibilidade e desempenho, suportando até 15 mil chamadas por minuto por API.     | ✔️        |
| RNF03 | Baixa latência para acesso às informações de bases externas    | Atualizações de dados ocorrem em até 15 minutos no sistema Metascale.                            | ✔️        |
| RNF04 | Escalabilidade Sem Impacto                                     | Capaz de expandir capacidade e funcionalidades sem impactar o desempenho atual.                  | ✔️        |
| RNF05 | Conformidade Regulatória                                       | Conforme regulamentos de proteção de dados, como GDPR, LGPD, entre outros.                       | ✔️        |
| RNF06 | Performance de resposta                                        | Responder às requisições dos clientes em até 80ms.                                               | ✔️        |
| RNF07 | Uso de tecnologias modernas e estáveis                        | Tecnologias modernas e estáveis reduzem riscos e simplificam manutenção.                        | ✔️        |
| RNF08 | Resiliência e tolerância a falhas                              | Tratamentos implementados para cenários de falhas, desastres e sobrecarregamento.                | ✔️        |

RF: Requisitos Funcionais.  
RNF: Requisitos Não Funcionais.

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
| [GitHub]([https://github.com/rafaeltannous](https://github.com/rafatannousfiap)) • [LinkedIn](https://www.linkedin.com/in/rafaeltannous/)            |

| **Felipe Otto**                                                                                                |
|:-------------------------------------------------------------------------------------------------------------:|
| Analista de Redes responsável pela configuração da VPC, EC2 e Load Balancer na AWS.                            |
| [GitHub](https://github.com/felipe-otto) • [LinkedIn](https://www.linkedin.com/in/felipe-otto)                 |

</div>


