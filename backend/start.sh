echo "Aguardando o banco de dados..."
while ! nc -z db 5432; do
  sleep 1
done

echo "Banco de dados disponível. Aplicando migrations..."
npx prisma migrate deploy

echo "Iniciando o servidor..."
npm run dev