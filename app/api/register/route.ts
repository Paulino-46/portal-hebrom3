import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../repositories/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, church, email, password } = body;

    // Validação básica dos campos obrigatórios
    if (!name || !church || !email || !password) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: nome, igreja, e-mail e senha são necessários." },
        { status: 400 }
      );
    }

    // Verificação de segurança para o Prisma
    if (!prisma || !prisma.user) {
      console.error("Modelo 'user' não encontrado no Prisma Client. Execute 'npx prisma generate'.");
      return NextResponse.json(
        { error: "Configuração do banco de dados incompleta." },
        { status: 500 }
      );
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este endereço de e-mail já está em uso." },
        { status: 400 }
      );
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de 'salt rounds'

    // Criar o novo usuário com a senha hashada
    const newUser = await prisma.user.create({
      data: {
        name,
        church,
        email,
        password: hashedPassword, // Salva a senha hashada
      },
    });

    return NextResponse.json(
      { message: "Usuário cadastrado com sucesso!", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar o seu cadastro." },
      { status: 500 }
    );
  }
}