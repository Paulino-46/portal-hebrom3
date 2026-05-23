import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import News from "../../../../lib/models/News";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, summary, content, author, image } = body;

    if (!title || !summary || !content || !author || !image) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    const db = await dbConnect();
    if (!db) {
      // Fallback: retornar sucesso com mock quando DB não está configurado
      console.warn("MongoDB não configurado. Retornando mock de notícia atualizada.");
      return NextResponse.json({ news: {
        id: params.id,
        title,
        summary,
        content,
        author,
        image,
        createdAt: new Date().toISOString(),
      } });
    }

    const updatedNews = await News.findByIdAndUpdate(
      params.id,
      { title, summary, content, author, image },
      { new: true }
    ).lean();

    if (!updatedNews) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ news: {
      id: updatedNews._id.toString(),
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

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await dbConnect();
    if (!db) {
      // Fallback: retornar sucesso com mock quando DB não está configurado
      console.warn("MongoDB não configurado. Retornando mock de exclusão.");
      return NextResponse.json({ success: true });
    }

    const deleted = await News.findByIdAndDelete(params.id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return NextResponse.json({ error: "Não foi possível excluir a notícia." }, { status: 500 });
  }
}
