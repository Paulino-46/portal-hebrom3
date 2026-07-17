import { NextResponse } from 'next/server';
import prisma from '../../../../repositories/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        church: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (mode === 'count') {
      return NextResponse.json({ count: users.length });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
