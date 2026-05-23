import { NextResponse } from "next/server";
import { getLatestEvents } from "../../../lib/events";
import dbConnect from "../../../lib/mongodb";
import Event from "../../../lib/models/Event";

export async function GET() {
  try {
    const events = await getLatestEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json({ error: "Não foi possível carregar os eventos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, location, date, time, image } = body;

    if (!title || !description || !location || !date || !time || !image) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    const db = await dbConnect();
    if (!db) {
      // Fallback: retornar sucesso com mock ID quando DB não está configurado
      console.warn("MongoDB não configurado. Retornando mock de evento criado.");
      return NextResponse.json({ event: {
        id: Math.random().toString(36).substring(2, 11),
        title,
        description,
        location,
        date: new Date(date).toISOString(),
        time,
        image,
      } }, { status: 201 });
    }

    const createdEvent = await Event.create({ title, description, location, date: new Date(date), time, image });
    return NextResponse.json({ event: {
      id: createdEvent._id.toString(),
      title: createdEvent.title,
      description: createdEvent.description,
      location: createdEvent.location,
      date: createdEvent.date.toISOString(),
      time: createdEvent.time,
      image: createdEvent.image,
    } }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: "Não foi possível criar o evento." }, { status: 500 });
  }
}
