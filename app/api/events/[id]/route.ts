import { NextResponse } from "next/server";
import prisma from "../../../../repositories/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    if (Number.isNaN(eventId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, location, date, time, image } = body;

    if (!title || !description || !location || !date || !time || !image) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 });
    }

    const prismaClient = prisma;
    if (!prismaClient) {
      console.error("Prisma não disponível em events/[id]/route.ts");
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    const updatedEvent = await prismaClient.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        time,
        image,
      },
    });

    return NextResponse.json({ event: {
      id: updatedEvent.id.toString(),
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    if (Number.isNaN(eventId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 });
    }

    const prismaClient = prisma;
    if (!prismaClient) {
      console.error("Prisma não disponível em events/[id]/route.ts");
      return NextResponse.json({ error: "Erro de configuração do banco de dados." }, { status: 500 });
    }

    await prismaClient.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return NextResponse.json({ error: "Não foi possível excluir o evento." }, { status: 500 });
  }
}
