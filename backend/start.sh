echo "Aguardando o banco de dados..."
while ! nc -z db 5432; do
  sleep 1
done

sleep 1

echo "Banco de dados disponível. Aplicando migrations..."
npx prisma migrate deploy && \
node insertDrivers.js

echo "Iniciando o servidor..."
npm run dev