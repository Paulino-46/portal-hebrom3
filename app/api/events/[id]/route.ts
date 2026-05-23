import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Event from "../../../../lib/models/Event";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, location, date, time, image } = body;

    if (!title || !description || !location || !date || !time || !image) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    const db = await dbConnect();
    if (!db) {
      // Fallback: retornar sucesso com mock quando DB não está configurado
      console.warn("MongoDB não configurado. Retornando mock de evento atualizado.");
      return NextResponse.json({ event: {
        id: params.id,
        title,
        description,
        location,
        date: new Date(date).toISOString(),
        time,
        image,
      } });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      { title, description, location, date: new Date(date), time, image },
      { new: true }
    ).lean();

    if (!updatedEvent) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ event: {
      id: updatedEvent._id.toString(),
      title: updatedEvent.title,
      description: updatedEvent.description,
      location: updatedEvent.location,
      date: updatedEvent.date.toISOString(),
      time: updatedEvent.time,
      image: updatedEvent.image,
    } });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: "Não foi possível atualizar o evento." }, { status: 500 });
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

    const deleted = await Event.findByIdAndDelete(params.id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return NextResponse.json({ error: "Não foi possível excluir o evento." }, { status: 500 });
  }
}
