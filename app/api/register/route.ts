import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../repositories/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;
    const email = body.email?.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Retornamos 401 mas com mensagem genérica por segurança
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // 2. Comparar a senha digitada com o hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Aqui você normalmente criaria uma sessão ou um JWT.
    // Por enquanto, retornamos o sucesso e os dados básicos.
    return NextResponse.json(
      {
        message: "Login realizado com sucesso!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro no login:", error);

    // Caso o erro P2021 ocorra aqui também (tabela não existe)
    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: "Erro de banco de dados. Tabela 'users' não encontrada." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}