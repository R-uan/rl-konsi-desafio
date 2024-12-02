# Desafio Software Engineer Júnior - Javascript

Este repositório contém a solução para o desafio de engenheiro de software júnior na Konsi. O ambiente local utiliza n8n e MongoDB, ambos executados em containers Docker.
### Requisitos
  - Docker Engine instalado e funcionando.

### Como utilizar
  1. Execute o comando abaixo no diretório do repositório:
```docker compose up```

2. Aguarde a inicialização completa dos containers. O n8n estará disponível em:
`http://localhost:5678/`.

3. No primeiro acesso ao n8n, crie uma owner account.

4. Após o login, navegue até:
    - Overview > Workflows > Create

5. Importe o arquivo workflow.json para aplicar o workflow personalizado.

6. Configure as credenciais do MongoDB nos nodes que requisitam conexão ao banco:
    - Se estiver utilizando o container MongoDB do docker-compose, escolha a opção Connection URL e insira:
      ```mongodb://mongodb:27017```
    > Apesar de o n8n exibir um aviso indicando que a coleção do MongoDB não existe ao testar a conexão, a mesma será automaticamente criada ao realizar a primeira inserção de dados. Este comportamento é padrão do MongoDB.

7. Após configurar as credenciais, inicie o workflow.

## Fluxo 1 - Inserção e atualização de documentos

#### POST Endpoint Node
Ativa o fluxo ao receber uma requisição POST nos seguintes endpoints:
- Test: `http://localhost:5678/webhook-test/lead`
- Production: `http://localhost:5678/webhook/lead`
#### Extract From File Node
Extrai os dados do arquivo CSV enviado na requisição POST e os repassa para o próximo node.
#### Format Data Node
Formata os dados conforme as especificações, retornando um objeto com os dados ajustados. (È o mesmo código do arquivo `workflow.json`)
#### Upsert/Update Node
Tenta atualizar os documentos no banco utilizando o CPF como referência. \
Se nenhum documento correspondente for encontrado, um novo será inserido.
#### Success Response Node
Retorna a resposta da requisição, concluindo o fluxo.

## Fluxo 2 - Consulta via webhook
#### GET Endpoint

Recebe uma requisição GET com o corpo da mensagem contendo os parâmetros de consulta.

- Teste: `http://localhost:5678/webhook-test/consulta`
- Production: `http://localhost:5678/webhook/consulta`
#### Parse Body Node

Interpreta o corpo da requisição e retorna os dados no formato JSON.

#### Check Phone Node

Verifica se o atributo phone está presente no JSON recebido.
- Sim: Continua para o próximo passo.
- Não: Envia uma resposta de erro (Bad Request Response).

#### Find Node

Consulta o banco de dados MongoDB utilizando os dados fornecidos na requisição.

#### Check Data Node

Verifica o resultado da consulta:

- Documento encontrado: Continua para o node Success Response.
- Nenhum documento encontrado: Continua para o node Not Found Response.

#### Success Response Node

Retorna uma resposta de sucesso contendo os dados do documento encontrado.
#### Not Found Response Node

Retorna uma mensagem indicando que o documento não foi encontrado.

#### Bad Request Response Node

Responde com um erro indicando que o corpo da requisição está inválido.