const sampleEvents = [
  {
    id: "1",
    title: "Culto de Louvor",
    description: "Ministração especial de música, pregação e comunhão para toda a família.",
    location: "Templo principal",
    date: new Date().toISOString(),
    time: "18:00",
    image: "/img/istockphoto-1144570336-1024x1024.jpg",
  },
  {
    id: "2",
    title: "Ação Social Hebrom III",
    description: "Atendimento à comunidade com distribuição de mantimentos e apoio pastoral.",
    location: "Sede central",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    time: "09:00",
    image: "/img/istockphoto-2195095144-1024x1024.jpg",
  },
];

async function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;

  try {
    const module = await import("../repositories/prisma");
    return module.default;
  } catch (error) {
    console.error("Falha ao importar Prisma:", error);
    return null;
  }
}

export async function getLatestEvents() {
  try {
    const prisma = await getPrismaClient();
    if (!prisma) {
      return sampleEvents;
    }

    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    if (!events || events.length === 0) {
      return sampleEvents;
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
      return sampleEvents;
    }
    console.error("Erro ao buscar eventos:", error);
    return sampleEvents;
  }
}
