# Projeto de Backend e Frontend com Docker

Este repositório contém a configuração de um ambiente de backend e frontend utilizando Docker. O backend é implementado com Node.js e Prisma para conectar-se a um banco de dados PostgreSQL, enquanto o frontend é uma aplicação React.

## Requisitos

Antes de rodar este projeto, verifique se você tem as seguintes ferramentas instaladas:

- **Docker**: Para executar os containers.
- **Node.js**: A versão 18 ou superior do Node.js deve estar instalada no seu sistema.
- **npm**: O Node Package Manager também deve estar instalado.

Além disso, as **portas** a seguir devem estar **livres** no seu sistema:

- Porta 80 (nginx)
- Porta 8080 (nginx)
- Porta 3000 (frontend)
- Porta 4000 (backend)
- Porta 5432 (PostgreSQL)

## Passos para rodar o projeto

1. **Clone o repositório:**

   Se ainda não tiver feito, clone o repositório para o seu ambiente local:

   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-repositorio>

   ```

2. **Criação do arquivo .env:**

   Após clonar o repositório, crie um arquivo .env na raiz do projeto com a seguinte variável:
   GOOGLE_API_KEY=<sua-chave-da-google-api>

   Certifique-se de substituir <sua-chave-da-google-api> pela chave válida que você obteve no Console da Google API.

3. **Dependências necessárias**

   Em seu amiente devem estar instaladas as seguintes dependências: node, npm, docker

4. **Rodando o projeto**

   Depois de criar o arquivo .env, inicie o ambiente de desenvolvimento com o comando:

   ```bash
   docker-compose up --build
   ```

   Esse comando irá construir as imagens dos containers e iniciar o backend, frontend, nginx e o banco de dados PostgreSQL.

5. **Acessando a aplicação**

   Após rodar o docker-compose up --build, você pode acessar a aplicação nos seguintes endereços:

   - Backend: http://localhost:8080
   - Frontend: http://localhost
