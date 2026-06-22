import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../repositories/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Pegando também o 'name' e 'church' que o Prisma exigiu no push anterior
    const { password, name, church } = body;
    const email = body.email?.toLowerCase().trim();

    // Validação dos campos obrigatórios para cadastro
    if (!email || !password || !name || !church) {
      return NextResponse.json(
        { error: "Nome, e-mail, igreja e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Verificar se o usuário já existe no banco
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    // 2. Criptografar a senha do usuário usando bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Criar e salvar o novo usuário na Aiven Cloud usando o Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        church, // Coluna obrigatória identificada no reset do banco
        password: hashedPassword,
      },
    });

    // Retorna o sucesso do cadastro sem expor a senha criptografada
    return NextResponse.json(
      {
        message: "Usuário registrado com sucesso!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          church: newUser.church,
        },
      },
      { status: 201 } // Status 201: Created (Criado com sucesso)
    );

  } catch (error: any) {
    console.error("Erro no registro:", error);

    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: "Erro de banco de dados. Tabela 'users' não encontrada." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor ao tentar registrar." },
      { status: 500 }
    );
  }
}