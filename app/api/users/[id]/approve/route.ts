import { NextResponse } from "next/server";
import prisma from "../../../../../repositories/prisma";
import { sendUserApprovalEmail } from "../../../../../lib/email";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const sessionRole = cookies.match(/(?:^|;\s*)portal_role=([^;]+)/)?.[1];
    const sessionProfile = cookies.match(/(?:^|;\s*)portal_profile=([^;]+)/)?.[1];

    if (sessionRole !== "admin" || sessionProfile !== "admin") {
      return NextResponse.json(
        { ok: false, message: "Apenas o administrador pode aprovar usuários." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ ok: false, message: "ID inválido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ ok: false, message: "Usuário não encontrado." }, { status: 404 });
    }

    if (user.isApproved) {
      return NextResponse.json({ ok: false, message: "Este usuário já está aprovado." }, { status: 400 });
    }

    const approvedUser = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true, approvedAt: new Date() },
      select: { id: true, name: true, email: true, church: true, isApproved: true, approvedAt: true },
    });

    await sendUserApprovalEmail({
      to: approvedUser.email,
      name: approvedUser.name,
    });

    return NextResponse.json({
      ok: true,
      message: "Usuário aprovado com sucesso.",
      user: approvedUser,
    });
  } catch (error) {
    console.error("Erro ao aprovar usuário:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível aprovar o usuário." },
      { status: 500 }
    );
  }
}
