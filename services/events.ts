import prisma from "../repositories/prisma";

export async function getLatestEvents() {
  try {
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
    // Check if error is a Prisma error (table does not exist)
    if (error && typeof error === 'object' && 'code' in error) {
      console.warn("Erro ao buscar eventos do banco. Usando dados de exemplo.", (error as any).code);
      return [];
    }
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}
