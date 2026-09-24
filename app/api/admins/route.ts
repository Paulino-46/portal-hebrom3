import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../repositories/prisma";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    return NextResponse.json({ ok: false, message: "Erro ao listar administradores." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, message: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { ok: false, message: "Já existe um administrador cadastrado com este e-mail." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, admin });
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    return NextResponse.json({ ok: false, message: "Erro ao criar administrador." }, { status: 500 });
  }
}
