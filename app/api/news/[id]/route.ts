// app/api/news/[id]/route.ts
import { NextResponse } from "next/server";
import { getPrismaClient } from "../../../../services/news";
import { put, del } from "@vercel/blob";

async function saveImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `news_images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(fileName, file, { access: "public" });
  return blob.url;
}

async function deleteImageFile(imageUrl: string | null) {
  if (!imageUrl) return;
  try {
    await del(imageUrl);
  } catch {
    // não crítico — apenas loga
    console.warn("Não foi possível remover o arquivo de imagem:", imageUrl);
  }
}

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

    const formData   = await request.formData();
    const title      = formData.get("title")        as string | null;
    const summary    = formData.get("summary")      as string | null;
    const content    = formData.get("content")      as string | null;
    const author     = formData.get("author")       as string | null;
    const imageFile  = formData.get("image")        as File | null;
    const keepOld    = formData.get("keepOldImage") as string | null;

    if (!title || !summary || !content || !author) {
      return NextResponse.json({ error: "Todos os campos de texto são obrigatórios." }, { status: 400 });
    }

    const prismaClient = await getPrismaClient();
    if (!prismaClient) {
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    const existing = await prismaClient.news.findUnique({ where: { id: newsId } });
    if (!existing) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    let imagePath: string = existing.image ?? "";

    if (imageFile && imageFile.size > 0) {
      imagePath = await saveImage(imageFile);
      await deleteImageFile(existing.image);
    } else if (!keepOld) {
      // Sem nova imagem e sem flag de manter — mantém a imagem existente silenciosamente
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
    return NextResponse.json({ error: "Não foi possível atualizar a notícia." }, { status: 500 });
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
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    const existing = await prismaClient.news.findUnique({ where: { id: newsId } });
    if (!existing) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    await prismaClient.news.delete({ where: { id: newsId } });
    await deleteImageFile(existing.image);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json({ error: "Não foi possível excluir a notícia." }, { status: 500 });
  }
}