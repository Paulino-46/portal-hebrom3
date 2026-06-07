export async function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;

  try {
    const module = await import("../repositories/prisma");
    return module.default;
  } catch (error) {
    console.error("Falha ao importar Prisma:", error);
    return null;
  }
}

export async function getLatestNews(limit = 6) {
  try {
    const prisma = await getPrismaClient();
    if (!prisma) {
      return [];
    }

    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    if (!news || news.length === 0) {
      return [];
    }

    return news.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      summary: item.summary,
      content: item.content,
      author: item.author,
      image: item.image,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch (error) {
    // Check if error is a Prisma error (table does not exist)
    if (error && typeof error === 'object' && 'code' in error) {
      console.warn("Erro ao buscar notícias do banco. Usando dados de exemplo.", (error as any).code);
      return [];
    }
    console.error("Erro ao buscar notícias:", error);
    return [];
  }
}

export async function getAllNews() {
  try {
    const prisma = await getPrismaClient();
    if (!prisma) {
      return [];
    }

    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (!news || news.length === 0) {
      return [];
    }

    return news.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      summary: item.summary,
      content: item.content,
      author: item.author,
      image: item.image,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      console.warn("Erro ao buscar notícias do banco. Usando dados de exemplo.", (error as any).code);
      return [];
    }
    console.error("Erro ao buscar notícias:", error);
    return [];
  }
}
