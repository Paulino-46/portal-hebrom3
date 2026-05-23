import dbConnect from "./mongodb";
import Event from "./models/Event";

const sampleEvents = [
  {
    id: "1",
    title: "Culto de Louvor",
    description: "Ministração especial de música, pregação e comunhão para toda a família.",
    location: "Templo principal",
    date: new Date().toISOString(),
    time: "18:00",
    image: "/img/istockphoto-1144570336-1024x1024.jpg",
  },
  {
    id: "2",
    title: "Ação Social Hebrom III",
    description: "Atendimento à comunidade com distribuição de mantimentos e apoio pastoral.",
    location: "Sede central",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    time: "09:00",
    image: "/img/istockphoto-2195095144-1024x1024.jpg",
  },
];

export async function getLatestEvents() {
  try {
    const db = await dbConnect();
    if (!db) {
      return sampleEvents;
    }

    const events = await Event.find().sort({ date: 1 }).lean();
    if (!events || events.length === 0) {
      return sampleEvents;
    }

    return events.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      location: item.location,
      date: item.date.toISOString(),
      time: item.time,
      image: item.image,
    }));
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return sampleEvents;
  }
}
