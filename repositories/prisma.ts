import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // Usamos um nome diferente para a variável global para evitar sombreamento
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL não está configurada. Prisma continuará indisponível até que a variável seja definida.");
}

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;