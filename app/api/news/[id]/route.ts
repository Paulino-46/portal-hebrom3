import { NextResponse } from "next/server";
import prisma from "../../../../repositories/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const newsId = Number(id);
    if (Number.isNaN(newsId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    const { title, summary, content, author, image } = body;

    if (!title || !summary || !content || !author || !image) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 });
    }

    const prismaClient = prisma;
    if (!prismaClient) {
      console.error("Prisma não disponível em news/[id]/route.ts");
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    const updatedNews = await prismaClient.news.update({
      where: { id: newsId },
      data: {
        title,
        summary,
        content,
        author,
        image,
      },
    });

    return NextResponse.json({ news: {
      id: updatedNews.id.toString(),
      title: updatedNews.title,
      summary: updatedNews.summary,
      content: updatedNews.content,
      author: updatedNews.author,
      image: updatedNews.image,
      createdAt: updatedNews.createdAt.toISOString(),
    } });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    return NextResponse.json({ error: "Não foi possível atualizar a notícia." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const newsId = Number(id);
    if (Number.isNaN(newsId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 });
    }

    const prismaClient = prisma;
    if (!prismaClient) {
      console.error("Prisma não disponível em news/[id]/route.ts");
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    await prismaClient.news.delete({
      where: { id: newsId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json({ error: "Não foi possível excluir a notícia." }, { status: 500 });
  }
}
