import { NextResponse } from "next/server";
import { getAllNews, getLatestNews, getPrismaClient } from "../../../services/news";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    const news = limit !== undefined ? await getLatestNews(limit) : await getAllNews();
    return NextResponse.json({ news });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return NextResponse.json({ error: "Não foi possível carregar as notícias." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, summary, content, author, image } = body;

    if (!title || !summary || !content || !author || !image) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 });
    }

    const prismaClient = await getPrismaClient();
    if (!prismaClient) {
      console.error("Prisma não disponível em news/route.ts");
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    const createdNews = await prismaClient.news.create({
      data: {
        title,
        summary,
        content,
        author,
        image,
      },
    });

    return NextResponse.json({ news: {
      id: createdNews.id.toString(),
      title: createdNews.title,
      summary: createdNews.summary,
      content: createdNews.content,
      author: createdNews.author,
      image: createdNews.image,
      createdAt: createdNews.createdAt.toISOString(),
    } }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar notícia:", error);
    const code = (error as any)?.code;
    if (code) {
      console.error("Prisma error code:", code);
      if (code === "P2021") {
        return NextResponse.json({ error: "Tabela 'News' não encontrada no banco de dados. Rode `npm run prisma:migrate`." }, { status: 500 });
      }
    }
    return NextResponse.json({ error: "Não foi possível criar a notícia." }, { status: 500 });
  }
}
