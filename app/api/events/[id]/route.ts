import { NextResponse } from "next/server";
import prisma from "../../../../repositories/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    if (Number.isNaN(eventId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const formData = await request.formData();

    const title         = formData.get("title") as string | null;
    const description   = formData.get("description") as string | null;
    const location      = formData.get("location") as string | null;
    const date          = formData.get("date") as string | null;
    const time          = formData.get("time") as string | null;
    const imageFile     = formData.get("image") as File | null;
    const currentImage  = formData.get("currentImage") as string | null;

    if (!title || !description || !location || !date || !time) {
      return NextResponse.json(
        { error: "Todos os campos de texto são obrigatórios." },
        { status: 400 }
      );
    }

    let imageUrl = currentImage ?? "";

    // Se enviou nova imagem, salva e apaga a antiga
    if (imageFile && imageFile.size > 0) {
      const bytes  = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "events");
      await mkdir(uploadsDir, { recursive: true });

      const uniqueName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
      const filePath   = path.join(uploadsDir, uniqueName);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/events/${uniqueName}`;

      // Remove arquivo antigo (silenciosamente, se não existir não é erro)
      if (currentImage) {
        const oldFilePath = path.join(process.cwd(), "public", currentImage);
        await unlink(oldFilePath).catch(() => null);
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        time,
        image: imageUrl,
      },
    });

    return NextResponse.json({
      event: {
        id:          updatedEvent.id.toString(),
        title:       updatedEvent.title,
        description: updatedEvent.description,
        location:    updatedEvent.location,
        date:        updatedEvent.date.toISOString(),
        time:        updatedEvent.time,
        image:       updatedEvent.image,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o evento." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    if (Number.isNaN(eventId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    // Buscar evento antes de deletar para remover a imagem do disco
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    await prisma.event.delete({ where: { id: eventId } });

    // Remove arquivo de imagem do disco (silenciosamente)
    if (event?.image) {
      const oldFilePath = path.join(process.cwd(), "public", event.image);
      await unlink(oldFilePath).catch(() => null);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o evento." },
      { status: 500 }
    );
  }
}