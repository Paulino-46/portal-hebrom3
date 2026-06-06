import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo foi enviado." }, { status: 400 });
    }

    // Criar diretório se não existir (em public/events_imag)
    const uploadDir = join(process.cwd(), "public", "events_imag");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Diretório pode já existir
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const filePath = join(uploadDir, fileName);

    // Salvar arquivo
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Retornar caminho relativo para uso na aplicação
    const relativePath = `/events_imag/${fileName}`;
    return NextResponse.json({ path: relativePath }, { status: 200 });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json({ error: "Erro ao fazer upload da imagem." }, { status: 500 });
  }
}
