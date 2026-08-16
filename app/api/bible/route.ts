import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_VERSE = {
  reference: 'Provérbios 3:5',
  text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.',
};

function normalizePassageInput(passage: string) {
  const trimmed = passage.trim();
  const aliases: Record<string, string> = {
    PRV: 'PRO',
    PROV: 'PRO',
    PS: 'PSA',
    JOAO: 'JHN',
    JO: 'JHN',
    '1JO': '1JN',
    '2JO': '2JN',
    '3JO': '3JN',
    '1COR': '1CO',
    '2COR': '2CO',
  };

  const [book, chapter, verse] = trimmed.split(/[.\s:]+/);
  if (!book || !chapter || !verse) {
    return trimmed;
  }

  const canonicalBook = aliases[book.toUpperCase()] ?? book.toUpperCase();
  return `${canonicalBook}.${chapter}.${verse}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passage = searchParams.get('passage') || 'PRO.3.5';
    const normalizedPassage = normalizePassageInput(passage);
    const apiKey = process.env.BIBLE_API_KEY || process.env.API_BIBLE_KEY || process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const baseUrl = process.env.BIBLE_API_URL || process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://rest.api.bible';

    if (!apiKey) {
      return NextResponse.json({
        reference: FALLBACK_VERSE.reference,
        text: FALLBACK_VERSE.text,
        source: 'fallback',
      });
    }

    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/v1/bibles/de4e12af7f28f599-01/passages/${encodeURIComponent(normalizedPassage)}?content-type=text`,
      {
        headers: { 'api-key': apiKey },
        cache: 'force-cache',
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        reference: FALLBACK_VERSE.reference,
        text: FALLBACK_VERSE.text,
        source: 'fallback',
      });
    }

    const data = await response.json();

    return NextResponse.json({
      reference: data?.data?.reference || FALLBACK_VERSE.reference,
      text: (data?.data?.content || FALLBACK_VERSE.text).replace(/\s+/g, ' ').trim(),
      source: 'api.bible',
    });
  } catch {
    return NextResponse.json({
      reference: FALLBACK_VERSE.reference,
      text: FALLBACK_VERSE.text,
      source: 'fallback',
    });
  }
}
