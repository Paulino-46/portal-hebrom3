import { NextResponse } from "next/server";
import { getLatestNews } from "../../../lib/news";
import dbConnect from "../../../lib/mongodb";
import News from "../../../lib/models/News";

export async function GET() {
  try {
    const news = await getLatestNews();
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

    const db = await dbConnect();
    if (!db) {
      // Fallback: retornar sucesso com mock ID quando DB não está configurado
      console.warn("MongoDB não configurado. Retornando mock de notícia criada.");
      return NextResponse.json({ news: {
        id: Math.random().toString(36).substring(2, 11),
        title,
        summary,
        content,
        author,
        image,
        createdAt: new Date().toISOString(),
      } }, { status: 201 });
    }

    const createdNews = await News.create({ title, summary, content, author, image });
    return NextResponse.json({ news: {
      id: createdNews._id.toString(),
      title: createdNews.title,
      summary: createdNews.summary,
      content: createdNews.content,
      author: createdNews.author,
      image: createdNews.image,
      createdAt: createdNews.createdAt.toISOString(),
    } }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar notícia:", error);
    return NextResponse.json({ error: "Não foi possível criar a notícia." }, { status: 500 });
  }
}
