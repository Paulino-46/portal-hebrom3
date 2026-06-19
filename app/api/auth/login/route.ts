import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../repositories/prisma";

export async function POST(request: Request) {
  const query = new URL(request.url).searchParams;
  const role = query.get("role") === "admin" ? "admin" : "user";

  try {
    const body = await request.json();
    const { password } = body;
    const email = body.email?.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Buscar o usuário no banco de dados pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // 2. Verificar se a senha está correta usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { ok: false, message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Sucesso no login
    return NextResponse.json({
      ok: true,
      redirect: `/dashboard?role=${role}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return NextResponse.json({ ok: false, message: "Erro ao processar login." }, { status: 500 });
  }
}
