import { NextResponse } from "next/server";
import prisma from "../../../../../repositories/prisma";
import { sendEditorApprovalEmail } from "../../../../../lib/email";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const sessionRole = cookies.match(/(?:^|;\s*)portal_role=([^;]+)/)?.[1];
    const sessionProfile = cookies.match(/(?:^|;\s*)portal_profile=([^;]+)/)?.[1];

    if (sessionRole !== "admin" || sessionProfile !== "admin") {
      return NextResponse.json(
        { ok: false, message: "Apenas o administrador pode confirmar editor." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const adminId = Number(id);

    if (Number.isNaN(adminId)) {
      return NextResponse.json({ ok: false, message: "ID inválido." }, { status: 400 });
    }

    const editor = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!editor) {
      return NextResponse.json({ ok: false, message: "Editor não encontrado." }, { status: 404 });
    }

    if (editor.profile !== "editor") {
      return NextResponse.json(
        { ok: false, message: "Este usuário não está com perfil de editor." },
        { status: 400 }
      );
    }

    const approvedEditor = await prisma.admin.update({
      where: { id: adminId },
      data: {
        isApproved: true,
        approvedAt: new Date(),
      },
    });

    await sendEditorApprovalEmail({
      to: approvedEditor.email,
      name: approvedEditor.name,
      isApproved: true,
      adminName: "Administrador",
      editorName: approvedEditor.name,
      editorEmail: approvedEditor.email,
      editorId: approvedEditor.id,
    });

    return NextResponse.json({
      ok: true,
      message: "Editor confirmado com sucesso.",
      admin: {
        id: approvedEditor.id,
        name: approvedEditor.name,
        email: approvedEditor.email,
        profile: approvedEditor.profile,
        isApproved: approvedEditor.isApproved,
        approvedAt: approvedEditor.approvedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao confirmar editor:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível confirmar o editor." },
      { status: 500 }
    );
  }
}
