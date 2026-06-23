// app/api/news/[id]/route.ts
import { NextResponse } from "next/server";
import { getPrismaClient } from "../../../../services/news";
import { uploadBlob, deleteBlob } from "@/lib/blob";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = Number(id);
    if (Number.isNaN(newsId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const formData  = await request.formData();
    const title     = formData.get("title")        as string | null;
    const summary   = formData.get("summary")      as string | null;
    const content   = formData.get("content")      as string | null;
    const author    = formData.get("author")       as string | null;
    const imageFile = formData.get("image")        as File | null;

    if (!title || !summary || !content || !author) {
      return NextResponse.json(
        { error: "Todos os campos de texto são obrigatórios." },
        { status: 400 }
      );
    }

    const prismaClient = await getPrismaClient();
    if (!prismaClient) {
      return NextResponse.json(
        { error: "Erro de configuração do banco de dados." },
        { status: 500 }
      );
    }

    const existing = await prismaClient.news.findUnique({ where: { id: newsId } });
    if (!existing) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    let imagePath: string = existing.image ?? "";

    if (imageFile && imageFile.size > 0) {
      const ext      = imageFile.name.split(".").pop() ?? "jpg";
      const fileName = `news_images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      imagePath = await uploadBlob(fileName, imageFile);
      await deleteBlob(existing.image);
    }

    const updated = await prismaClient.news.update({
      where: { id: newsId },
      data: { title, summary, content, author, image: imagePath },
    });

    return NextResponse.json({
      news: {
        id:        updated.id.toString(),
        title:     updated.title,
        summary:   updated.summary,
        content:   updated.content,
        author:    updated.author,
        image:     updated.image,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a notícia." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = Number(id);
    if (Number.isNaN(newsId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const prismaClient = await getPrismaClient();
    if (!prismaClient) {
      return NextResponse.json(
        { error: "Erro de configuração do banco de dados." },
        { status: 500 }
      );
    }

    const existing = await prismaClient.news.findUnique({ where: { id: newsId } });
    if (!existing) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    await prismaClient.news.delete({ where: { id: newsId } });
    await deleteBlob(existing.image);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a notícia." },
      { status: 500 }
    );
  }
}