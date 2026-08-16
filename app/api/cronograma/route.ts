import { NextResponse } from 'next/server';
import { getCronogramaItems } from '../../../services/cronograma';

export async function GET() {
  try {
    const cronograma = await getCronogramaItems();
    return NextResponse.json({ cronograma });
  } catch (error) {
    console.error('Erro ao buscar cronograma:', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar o cronograma.' },
      { status: 500 }
    );
  }
}
