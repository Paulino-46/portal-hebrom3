import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../repositories/prisma";
import { notifyAdminOfPendingEditor, sendEditorApprovalEmail } from "../../../lib/email";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        isApproved: true,
        approvedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pendingEditors = admins.filter((admin) => admin.profile === "editor" && !admin.isApproved);

    return NextResponse.json({ admins, pendingEditors });
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    return NextResponse.json({ ok: false, message: "Erro ao listar administradores." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, message: "Banco de dados não configurado. Verifique a variável DATABASE_URL." },
        { status: 503 }
      );
    }

    const cookies = request.headers.get("cookie") || "";
    const sessionRole = cookies.match(/(?:^|;\s*)portal_role=([^;]+)/)?.[1];
    const sessionProfile = cookies.match(/(?:^|;\s*)portal_profile=([^;]+)/)?.[1];
    const adminCount = await prisma.admin.count({
      where: { profile: "admin" },
    });

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const profile = body.profile === "admin" ? "admin" : "editor";
    const isApproved = profile === "admin";

    if (
      profile === "admin" &&
      adminCount > 0 &&
      (sessionRole !== "admin" || sessionProfile !== "admin")
    ) {
      return NextResponse.json(
        { ok: false, message: "Apenas um administrador pode criar outro administrador." },
        { status: 403 }
      );
    }

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
        profile,
        isApproved,
        approvedAt: isApproved ? new Date() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        isApproved: true,
        approvedAt: true,
        createdAt: true,
      },
    });

    if (profile === "editor") {
      const adminUsers = await prisma.admin.findMany({
        where: { profile: "admin" },
        select: { email: true, name: true },
      });

      for (const adminUser of adminUsers) {
        await notifyAdminOfPendingEditor({
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          editorName: name,
          editorEmail: email,
          editorId: admin.id,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      admin,
      message:
        profile === "editor"
          ? "Cadastro enviado para aprovação do administrador. Você receberá um e-mail após a confirmação."
          : "Administrador cadastrado com sucesso.",
    });
  } catch (error: any) {
    console.error("Erro ao criar administrador:", error);

    const isDbConnectionError =
      error?.name === "PrismaClientInitializationError" ||
      error?.code === "P1001" ||
      error?.code === "P1017" ||
      /Can't reach database server|ECONNREFUSED|ENOTFOUND|Connection refused/i.test(
        String(error?.message || "")
      );

    return NextResponse.json(
      {
        ok: false,
        message: isDbConnectionError
          ? "Não foi possível conectar ao banco de dados. Verifique a conexão e tente novamente."
          : "Erro ao criar administrador.",
      },
      { status: isDbConnectionError ? 503 : 500 }
    );
  }
}
