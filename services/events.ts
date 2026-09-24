export async function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;

  try {
    const module = await import("../repositories/prisma");
    return module.default;
  } catch (error) {
    console.error("Falha ao importar Prisma em eventos:", error);
    return null;
  }
}

export async function getLatestEvents() {
  try {
    const prisma = await getPrismaClient();
    if (!prisma) {
      return [];
    }

    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    if (!events || events.length === 0) {
      return [];
    }

    return events.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      location: item.location,
      date: item.date.toISOString(),
      time: item.time,
      image: item.image,
    }));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      console.warn("Erro ao buscar eventos do banco. Usando lista vazia.", (error as any).code);
      return [];
    }
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}
