// app/api/news/route.ts
import { NextResponse } from "next/server";
import { getAllNews, getPrismaClient } from "../../../services/news";
import { uploadBlob } from "@/lib/blob";

export async function GET(request: Request) {
  try {
    const url        = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit      = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    const news = limit !== undefined
      ? await (await import("../../../services/news")).getLatestNews(limit)
      : await getAllNews();

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as notícias." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData  = await request.formData();
    const title     = formData.get("title")   as string | null;
    const summary   = formData.get("summary") as string | null;
    const content   = formData.get("content") as string | null;
    const author    = formData.get("author")  as string | null;
    const imageFile = formData.get("image")   as File | null;

    if (!title || !summary || !content || !author) {
      return NextResponse.json(
        { error: "Todos os campos de texto são obrigatórios." },
        { status: 400 }
      );
    }
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "A imagem é obrigatória para criar uma notícia." },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Banco de dados não configurado." },
        { status: 500 }
      );
    }

    const prismaClient = await getPrismaClient();
    if (!prismaClient) {
      return NextResponse.json(
        { error: "Erro de configuração do banco de dados." },
        { status: 500 }
      );
    }

    const ext       = imageFile.name.split(".").pop() ?? "jpg";
    const fileName  = `news_images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const imagePath = await uploadBlob(fileName, imageFile);

    const created = await prismaClient.news.create({
      data: { title, summary, content, author, image: imagePath },
    });

    return NextResponse.json(
      {
        news: {
          id:        created.id.toString(),
          title:     created.title,
          summary:   created.summary,
          content:   created.content,
          author:    created.author,
          image:     created.image,
          createdAt: created.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar notícia:", error);
    const code = (error as any)?.code;
    if (code === "P2021") {
      return NextResponse.json(
        { error: "Tabela 'News' não encontrada. Rode `npm run prisma:migrate`." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Não foi possível criar a notícia." },
      { status: 500 }
    );
  }
}