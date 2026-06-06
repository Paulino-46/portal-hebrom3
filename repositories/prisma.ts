import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = process.env.DATABASE_URL
  ? globalThis.prisma || new PrismaClient()
  : undefined;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
