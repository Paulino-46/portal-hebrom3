import { NextResponse } from "next/server";

const validCredentials = {
  user: {
    email: process.env.USER_EMAIL || "user@hebrom3.com",
    password: process.env.USER_PASSWORD || "user123",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@hebrom3.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
};

export async function POST(request: Request) {
  const query = new URL(request.url).searchParams;
  const role = query.get("role") === "admin" ? "admin" : "user";

  try {
    const body = await request.json();
    const { email, password } = body;
    const target = validCredentials[role];

    if (email === target.email && password === target.password) {
      return NextResponse.json({ ok: true, redirect: `/dashboard?role=${role}` });
    }

    return NextResponse.json({ ok: false, message: "Credenciais inválidas." }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Erro ao processar login." }, { status: 500 });
  }
}
