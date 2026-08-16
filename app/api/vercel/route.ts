import { NextRequest, NextResponse } from "next/server";

const fallbackVerse = {
  data: {
    id: "PRO.3.5",
    reference: "Provérbios 3:5",
    content: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
  },
};

function normalizePassageInput(passage: string) {
  const normalized = passage.trim();
  const aliases: Record<string, string> = {
    PRV: "PRO",
    PROV: "PRO",
    PS: "PSA",
    JOAO: "JHN",
    JO: "JHN",
    "1JO": "1JN",
    "2JO": "2JN",
    "3JO": "3JN",
    "1COR": "1CO",
    "2COR": "2CO",
  };

  const [book, chapter, verse] = normalized.split(/[.\s:]+/);
  if (!book || !chapter || !verse) {
    return normalized;
  }

  const canonicalBook = aliases[book.toUpperCase()] ?? book.toUpperCase();
  return `${canonicalBook}.${chapter}.${verse}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let passage = searchParams.get("passage"); // Ex: "JHN.3.16" (João 3:16)
  const bibleId = searchParams.get("bibleId") || "de4e12af7f28f599-01"; // Versão em Português (Almeida Revista e Corrigida 2009)
  const apiKey = process.env.BIBLE_API_KEY || process.env.API_BIBLE_KEY || process.env.NEXT_PUBLIC_BIBLE_API_KEY;
  const baseUrl = process.env.BIBLE_API_URL || process.env.NEXT_PUBLIC_BIBLE_API_URL || "https://rest.api.bible";

  if (!passage) {
    return NextResponse.json(
      { error: "O parâmetro 'passage' (passagem) é obrigatório." },
      { status: 400 }
    );
  }

  passage = normalizePassageInput(passage);

  if (!apiKey) {
    console.error("A chave da API para API.Bible não está configurada. Defina BIBLE_API_KEY ou API_BIBLE_KEY no Vercel.");
    return NextResponse.json(
      { error: "O serviço da Bíblia não está configurado corretamente no servidor." },
      { status: 500 }
    );
  }

  const url = `${baseUrl.replace(/\/$/, "")}/v1/bibles/${bibleId}/passages/${encodeURIComponent(passage)}?content-type=text`;

  console.log(`[API.Bible] Buscando: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "api-key": apiKey,
      },
      cache: "force-cache",
    });

    console.log(`[API.Bible] Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API.Bible] Erro ${response.status}:`, errorText);
      console.error(`[API.Bible] URL tentada: ${url}`);
      console.error(`[API.Bible] Bible ID: ${bibleId}`);
      console.error(`[API.Bible] Passage: ${passage}`);

      if (response.status === 404 && /^(PRV|PROV|PRO)\./i.test(passage)) {
        return NextResponse.json(fallbackVerse, { status: 200 });
      }

      return NextResponse.json(
        {
          error: `Falha ao buscar os dados da Bíblia (Status: ${response.status})`,
          details: errorText,
          debugInfo: {
            url,
            bibleId,
            passage,
          },
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
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}