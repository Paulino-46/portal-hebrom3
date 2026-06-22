import { NextResponse } from "next/server";
import { getLatestEvents } from "../../../services/events";
import prisma from "../../../repositories/prisma";
import { put, del } from "@vercel/blob";

export async function GET() {
  try {
    const events = await getLatestEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os eventos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title       = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const location    = formData.get("location") as string | null;
    const date        = formData.get("date") as string | null;
    const time        = formData.get("time") as string | null;
    const imageFile   = formData.get("image") as File | null;

    if (!title || !description || !location || !date || !time || !imageFile) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios, incluindo a imagem." },
        { status: 400 }
      );
    }

    const uniqueName = `events/${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;

    const blob = await put(uniqueName, imageFile, {
      access: "public",
    });

    const createdEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        time,
        image: blob.url,
      },
    });

    return NextResponse.json(
      {
        event: {
          id:          createdEvent.id.toString(),
          title:       createdEvent.title,
          description: createdEvent.description,
          location:    createdEvent.location,
          date:        createdEvent.date.toISOString(),
          time:        createdEvent.time,
          image:       createdEvent.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json(
      { error: "Não foi possível criar o evento." },
      { status: 500 }
    );
  }
}