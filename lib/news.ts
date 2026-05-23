import dbConnect from "./mongodb";
import News from "./models/News";

const sampleNews = [
  {
    id: "1",
    title: "Bem-vindo ao Portal Hebrom III",
    summary: "Acompanhe as novidades da igreja Hebrom III neste portal de notícias.",
    content: "Um espaço moderno para publicar anúncios, avisos e mensagens especiais para toda a comunidade.",
    author: "Equipe Hebrom III",
    image: "/img/istockphoto-1144570336-1024x1024.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Culto de Louvor e Adoração neste Sábado",
    summary: "Prepare-se para o culto deste Sábado com mensagens especiais e louvor.",
    content: "Venha celebrar com música, testemunhos e uma palavra forte para renovar sua fé.",
    author: "Pr. Francisco Paulo Dias",
    image: "/img/istockphoto-2264133506-1024x1024.jpg",
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
      content: item.content,
      author: item.author,
      image: item.image,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return sampleNews;
  }
}
