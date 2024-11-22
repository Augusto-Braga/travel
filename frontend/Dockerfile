# Use uma imagem Node.js
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos para o contêiner
COPY . .

# Exponha a porta usada pelo frontend
EXPOSE 3000

# Comando para rodar o frontend
CMD ["npm", "start"]