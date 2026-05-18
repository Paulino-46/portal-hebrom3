import dbConnect from "./mongodb";
import News from "./models/News";

const sampleNews = [
  {
    id: "1",
    title: "Bem-vindo ao Portal Hebrom III",
    summary: "Acompanhe as novidades da igreja Hebrom III neste portal de notícias.",
    author: "Equipe Hebrom III",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Culto de Celebração neste Domingo",
    summary: "Prepare-se para o culto deste domingo com mensagens especiais e louvor.",
    author: "Pastor João",
    createdAt: new Date().toISOString(),
  },
];

export async function getLatestNews() {
  try {
    const db = await dbConnect();
    if (!db) {
      return sampleNews;
    }

    const news = await News.find().sort({ createdAt: -1 }).limit(6).lean();
    if (!news || news.length === 0) {
      return sampleNews;
    }

    return news.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      summary: item.summary,
      author: item.author,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return sampleNews;
  }
}
