import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../repositories/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validação básica dos campos obrigatórios
    if (!email || !password) {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificação de segurança para o Prisma
    if (!prisma || !prisma.user) {
      console.error("Modelo 'user' não encontrado no Prisma Client. Execute 'npx prisma generate'.");
      return NextResponse.json(
        { message: "Configuração do banco de dados incompleta." },
        { status: 500 }
      );
    }

    // Buscar o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não for encontrado ou a senha não corresponder
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Login bem-sucedido
    // Aqui você pode gerar um token JWT, configurar uma sessão, etc.
    // Por enquanto, vamos apenas redirecionar para o dashboard.
    return NextResponse.json({ ok: true, redirect: "/dashboard" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao tentar fazer login:", error);
    return NextResponse.json({ message: "Ocorreu um erro ao tentar fazer login." }, { status: 500 });
  }
}