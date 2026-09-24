type EditorApprovalEmailPayload = {
  to: string;
  name: string;
  isApproved: boolean;
  adminName?: string;
  editorName?: string;
  editorEmail?: string;
  editorId?: number;
};

export async function sendEditorApprovalEmail({
  to,
  name,
  isApproved,
  adminName,
  editorName,
  editorEmail,
  editorId,
}: EditorApprovalEmailPayload) {
  const subject = isApproved
    ? "Seu cadastro como editor foi confirmado"
    : "Novo cadastro de editor pendente de aprovação";

  const body = isApproved
    ? `Olá ${name},\n\nSeu cadastro como editor foi confirmado pelo administrador${adminName ? ` ${adminName}` : ""}.\nVocê já pode acessar o painel com as permissões de editor.\n\nDados da conta:\n- Nome: ${editorName ?? name}\n- E-mail: ${editorEmail ?? to}\n- ID: ${editorId ?? "-"}\n\nAtenciosamente,\nPortal Hebrom 3.`
    : `Olá ${name},\n\nFoi registrado um novo cadastro de editor pendente de aprovação.\n\nDetalhes:\n- Nome: ${editorName ?? name}\n- E-mail: ${editorEmail ?? to}\n- ID: ${editorId ?? "-"}\n\nAcesse o painel administrativo para confirmar a conta.\n\nAtenciosamente,\nPortal Hebrom 3.`;

  const payload = {
    to,
    subject,
    body,
    isApproved,
    sentAt: new Date().toISOString(),
  };

  if (process.env.EMAIL_WEBHOOK_URL) {
    try {
      await fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn("Falha ao enviar e-mail de aprovação via webhook:", error);
    }
  }

  console.log(`[EMAIL ${isApproved ? "APPROVED" : "PENDING"}] ${to}: ${subject}`);
  console.log(body);

  return { ok: true, simulated: true };
}

export async function notifyAdminOfPendingEditor({
  adminName,
  adminEmail,
  editorName,
  editorEmail,
  editorId,
}: {
  adminName: string;
  adminEmail: string;
  editorName: string;
  editorEmail: string;
  editorId: number;
}) {
  return sendEditorApprovalEmail({
    to: adminEmail,
    name: adminName,
    isApproved: false,
    editorName,
    editorEmail,
    editorId,
  });
}

export async function notifyAdminOfPendingUser({
  adminName,
  adminEmail,
  userName,
  userEmail,
  userId,
}: {
  adminName: string;
  adminEmail: string;
  userName: string;
  userEmail: string;
  userId: number;
}) {
  const subject = "Novo cadastro de usuário pendente de aprovação";
  const body = `Olá ${adminName},\n\nUm editor cadastrou um novo usuário que aguarda sua aprovação.\n\nDetalhes:\n- Nome: ${userName}\n- E-mail: ${userEmail}\n- ID: ${userId}\n\nAcesse o painel administrativo para aprovar o cadastro.\n\nAtenciosamente,\nPortal Hebrom 3.`;

  if (process.env.EMAIL_WEBHOOK_URL) {
    try {
      await fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: adminEmail,
          subject,
          body,
          isApproved: false,
          type: "user-registration",
          sentAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn("Falha ao enviar e-mail de usuário pendente:", error);
    }
  }

  console.log(`[EMAIL PENDING USER] ${adminEmail}: ${subject}`);
  console.log(body);
  return { ok: true, simulated: true };
}

export async function sendUserApprovalEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const subject = "Seu cadastro foi aprovado";
  const body = `Olá ${name},\n\nSeu cadastro no Portal Hebrom 3 foi aprovado pelo administrador. Você já pode entrar com seu e-mail e senha.\n\nAtenciosamente,\nPortal Hebrom 3.`;

  if (process.env.EMAIL_WEBHOOK_URL) {
    try {
      await fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          body,
          isApproved: true,
          type: "user-approval",
          sentAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn("Falha ao enviar e-mail de aprovação de usuário:", error);
    }
  }

  console.log(`[EMAIL APPROVED USER] ${to}: ${subject}`);
  return { ok: true, simulated: true };
}
