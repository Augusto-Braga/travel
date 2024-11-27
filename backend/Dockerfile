FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npx prisma generate

# Instala o netcat
RUN apt-get update && apt-get install -y netcat-openbsd

EXPOSE 4000
CMD ["sh", "./start.sh"]