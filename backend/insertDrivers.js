import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://myuser:mypassword@db:5432/database",
    },
  },
});

prisma.$connect().catch((e) => {
  console.error("Erro ao conectar ao banco de dados:", e);
  process.exit(1);
});

async function main() {
  const drivers = await prisma.driver.findMany();
  if (drivers.length === 0) {
    await prisma.driver.createMany({
      data: [
        {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
          review: {
            rating: 2,
            comment:
              "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
          },
          price_per_km: 2.5,
          min_km: 1,
        },
        {
          name: "Dominic Toretto",
          description:
            "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
          vehicle: "Dodge Charger R/T 1970 modificado",
          review: {
            rating: 4,
            comment:
              "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
          },
          price_per_km: 5,
          min_km: 5,
        },
        {
          name: "James Bond",
          description:
            "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
          vehicle: "Aston Martin DB5 clássico",
          review: {
            rating: 5,
            comment:
              "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
          },
          price_per_km: 10,
          min_km: 10,
        },
      ],
    });

    console.log("Motoristas inseridos!");
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
