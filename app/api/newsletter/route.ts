import { NextResponse } from "next/server";
import prisma from "../../../repositories/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.create({ data: { email } });

    return NextResponse.json(
      { message: "Inscrição realizada com sucesso!" },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Este e-mail já está inscrito na newsletter." },
        { status: 409 }
      );
    }

    console.error("Erro ao inscrever e-mail na newsletter:", error);
    return NextResponse.json(
      { error: "Não foi possível concluir a inscrição agora." },
      { status: 500 }
    );
  }
}
