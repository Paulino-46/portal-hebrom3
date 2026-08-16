import { Prisma } from "@prisma/client";
import prisma from "../repositories/prisma";

export type CronogramaItem = {
  id: string;
  title: string;
  day: string;
  time: string | null;
  details: string | null;
  description: string | null;
  speaker: string | null;
  date: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
};

type CronogramaRecord = Prisma.CronogramaGetPayload<{}>;

export async function getCronogramaItems(limit?: number) {
  try {
    const items: CronogramaRecord[] = await prisma.cronograma.findMany({
      orderBy: [{ date: "asc" }, { createdAt: "desc" }],
      take: limit,
    });

    if (!items || items.length === 0) {
      return [] as CronogramaItem[];
    }

    return items.map((item: CronogramaRecord) => ({
      id: item.id.toString(),
      title: item.title,
      day: item.day,
      time: item.time,
      details: item.details,
      description: item.description,
      speaker: item.speaker,
      date: item.date ? item.date.toISOString() : null,
      type: item.type,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      console.warn("Erro ao buscar cronograma do banco. Usando dados vazios.", (error as any).code);
      return [] as CronogramaItem[];
    }

    console.error("Erro ao buscar cronograma:", error);
    return [] as CronogramaItem[];
  }
}

export async function getCronogramaById(id: number) {
  try {
    const item: CronogramaRecord | null = await prisma.cronograma.findUnique({
      where: { id },
    });

    if (!item) {
      return null;
    }

    return {
      id: item.id.toString(),
      title: item.title,
      day: item.day,
      time: item.time,
      details: item.details,
      description: item.description,
      speaker: item.speaker,
      date: item.date ? item.date.toISOString() : null,
      type: item.type,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    } satisfies CronogramaItem;
  } catch (error) {
    console.error("Erro ao buscar item do cronograma:", error);
    return null;
  }
}

export async function createCronogramaItem(data: {
  title: string;
  day: string;
  time?: string | null;
  details?: string | null;
  description?: string | null;
  speaker?: string | null;
  date?: Date | string | null;
  type?: string;
}) {
  try {
    const item: CronogramaRecord = await prisma.cronograma.create({
      data: {
        title: data.title,
        day: data.day,
        time: data.time ?? null,
        details: data.details ?? null,
        description: data.description ?? null,
        speaker: data.speaker ?? null,
        date: data.date ? new Date(data.date) : null,
        type: data.type ?? "weekly",
      },
    });

    return {
      id: item.id.toString(),
      title: item.title,
      day: item.day,
      time: item.time,
      details: item.details,
      description: item.description,
      speaker: item.speaker,
      date: item.date ? item.date.toISOString() : null,
      type: item.type,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    } satisfies CronogramaItem;
  } catch (error) {
    console.error("Erro ao criar item do cronograma:", error);
    throw error;
  }
}

export async function updateCronogramaItem(
  id: number,
  data: Partial<{
    title: string;
    day: string;
    time: string | null;
    details: string | null;
    description: string | null;
    speaker: string | null;
    date: Date | string | null;
    type: string;
  }>,
) {
  try {
    const item: CronogramaRecord = await prisma.cronograma.update({
      where: { id },
      data: {
        ...data,
        date: data.date !== undefined ? (data.date ? new Date(data.date) : null) : undefined,
      },
    });

    return {
      id: item.id.toString(),
      title: item.title,
      day: item.day,
      time: item.time,
      details: item.details,
      description: item.description,
      speaker: item.speaker,
      date: item.date ? item.date.toISOString() : null,
      type: item.type,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    } satisfies CronogramaItem;
  } catch (error) {
    console.error("Erro ao atualizar item do cronograma:", error);
    throw error;
  }
}

export async function deleteCronogramaItem(id: number) {
  try {
    const item: CronogramaRecord = await prisma.cronograma.delete({
      where: { id },
    });

    return item.id;
  } catch (error) {
    console.error("Erro ao remover item do cronograma:", error);
    throw error;
  }
}
