import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const passage = searchParams.get("passage"); // Ex: "JHN.3.16" (João 3:16)
  const bibleId = searchParams.get("bibleId") || "de4e12af7f28f599-01"; // Versão em Português (Almeida Revista e Corrigida 2009)

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

  console.log(`[API.Bible] Buscando: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "api-key": API_BIBLE_KEY,
      },
      cache: 'force-cache', // Faz cache da resposta para melhorar o desempenho
    });

    console.log(`[API.Bible] Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API.Bible] Erro ${response.status}:`, errorText);
      console.error(`[API.Bible] URL tentada: ${url}`);
      console.error(`[API.Bible] Bible ID: ${bibleId}`);
      console.error(`[API.Bible] Passage: ${passage}`);
      
      return NextResponse.json(
        { 
          error: `Falha ao buscar os dados da Bíblia (Status: ${response.status})`,
          details: errorText,
          debugInfo: {
            url,
            bibleId,
            passage,
          }
        }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API.Bible] Dados retornados:`, data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[API.Bible] Erro ao conectar:", error);
    return NextResponse.json(
      { 
        error: "Erro interno ao buscar os dados da Bíblia.",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}