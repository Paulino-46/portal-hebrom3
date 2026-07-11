import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const passage = searchParams.get("passage"); // Ex: "JHN.3.16" (João 3:16)
  const bibleId = searchParams.get("bibleId") || "01b29f4b342acc35-01"; // Versão em Português (Almeida Corrigida Fiel) como padrão

  if (!passage) {
    return NextResponse.json(
      { error: "O parâmetro 'passage' (passagem) é obrigatório." },
      { status: 400 }
    );
  }

  const API_BIBLE_KEY = process.env.API_BIBLE_KEY;

  if (!API_BIBLE_KEY) {
    console.error("A chave da API para API.Bible não está configurada no .env.local");
    return NextResponse.json(
      { error: "O serviço da Bíblia não está configurado corretamente no servidor." },
      { status: 500 }
    );
  }

  const url = `https://rest.api.bible/v1/bibles/${bibleId}/passages/${passage}?content-type=text`;

  try {
    const response = await fetch(url, {
      headers: {
        "api-key": API_BIBLE_KEY,
      },
      cache: 'force-cache', // Faz cache da resposta para melhorar o desempenho
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API.Bible:", errorData);
      return NextResponse.json({ error: "Falha ao buscar os dados da Bíblia." }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro ao conectar com a API.Bible:", error);
    return NextResponse.json({ error: "Erro interno ao buscar os dados da Bíblia." }, { status: 500 });
  }
}