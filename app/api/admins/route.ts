import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../repositories/prisma";
import { notifyAdminOfPendingEditor, notifyAdminOfPendingUser } from "../../../lib/email";

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
    const adminCount = await prisma.admin.count();

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const church = String(body.church || "").trim();
    const requestedProfile = body.profile === "admin" ? "admin" : "editor";
    const requestedAccountType = body.accountType === "user" ? "user" : "admin";
    const profile = adminCount === 0 ? "admin" : requestedProfile;
    const isApproved = profile === "admin";
    const isCreatingUser = requestedAccountType === "user";

    if (adminCount === 0 && (requestedProfile !== "admin" || isCreatingUser)) {
      return NextResponse.json(
        { ok: false, message: "O primeiro cadastro deve ser de administrador." },
        { status: 400 }
      );
    }

    const canCreateUser = sessionRole === "admin" && (sessionProfile === "admin" || sessionProfile === "editor");

    if (isCreatingUser && !canCreateUser) {
      return NextResponse.json(
        { ok: false, message: "Apenas um administrador ou editor autenticado pode cadastrar um usuário." },
        { status: 403 }
      );
    }

    if (
      adminCount > 0 &&
      !isCreatingUser &&
      profile === "admin" &&
      (sessionRole !== "admin" || sessionProfile !== "admin")
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "O primeiro administrador pode se cadastrar livremente. Depois disso, apenas um administrador autenticado pode criar outro.",
        },
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

    if (isCreatingUser && !church) {
      return NextResponse.json(
        { ok: false, message: "A igreja é obrigatória para o cadastro do usuário." },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin || existingUser) {
      return NextResponse.json(
        { ok: false, message: "Já existe um cadastro com este e-mail." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isCreatingUser) {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          church,
          password: hashedPassword,
          isApproved: false,
        },
        select: { id: true, name: true, email: true, church: true, isApproved: true, createdAt: true },
      });

      const adminUsers = await prisma.admin.findMany({
        where: { profile: "admin", isApproved: true },
        select: { email: true, name: true },
      });

      for (const adminUser of adminUsers) {
        await notifyAdminOfPendingUser({
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          userName: name,
          userEmail: email,
          userId: user.id,
        });
      }

      return NextResponse.json({
        ok: true,
        user,
        message: "Cadastro de usuário enviado para aprovação do administrador.",
      });
    }

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
  } catch (error: unknown) {
    console.error("Erro ao criar administrador:", error);

    const errorMessage = error instanceof Error ? error.message : "";
    const errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    const errorName = typeof error === "object" && error && "name" in error ? String(error.name) : "";

    const isDbConnectionError =
      errorName === "PrismaClientInitializationError" ||
      errorCode === "P1001" ||
      errorCode === "P1017" ||
      /Can't reach database server|ECONNREFUSED|ENOTFOUND|Connection refused/i.test(
        errorMessage
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
