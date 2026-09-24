import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../repositories/prisma";

const DEFAULT_ADMIN_EMAIL = "admin@hebrom3.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

async function ensureDefaultAdmin() {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: DEFAULT_ADMIN_EMAIL },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

  return prisma.admin.create({
    data: {
      name: "Administrador",
      email: DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
    },
  });
}

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

    const isAdminLogin = role === "admin";

    if (isAdminLogin) {
      const admin = await ensureDefaultAdmin();

      if (admin.email.toLowerCase() !== email.toLowerCase()) {
        const foundAdmin = await prisma.admin.findUnique({ where: { email } });

        if (!foundAdmin) {
          return NextResponse.json(
            { ok: false, message: "Credenciais de administrador inválidas." },
            { status: 401 }
          );
        }

        const isPasswordValid = await bcrypt.compare(password, foundAdmin.password);

        if (!isPasswordValid) {
          return NextResponse.json(
            { ok: false, message: "Credenciais de administrador inválidas." },
            { status: 401 }
          );
        }

        const response = NextResponse.json({
          ok: true,
          redirect: "/dashboard",
          user: {
            id: foundAdmin.id,
            name: foundAdmin.name,
            email: foundAdmin.email,
            role: "admin",
          },
        });

        response.cookies.set("portal_role", "admin", {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 8,
        });

        return response;
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { ok: false, message: "Credenciais de administrador inválidas." },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        ok: true,
        redirect: "/dashboard",
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });

      response.cookies.set("portal_role", "admin", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { ok: false, message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      redirect: "/",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });

    response.cookies.set("portal_role", "user", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return NextResponse.json({ ok: false, message: "Erro ao processar login." }, { status: 500 });
  }
}
