import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://myuser:mypassword@db:5432/database",
    },
  },
});
export default prisma;
