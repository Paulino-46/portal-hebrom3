import { NextResponse } from 'next/server';
import { buildAssistantReply } from '@/lib/ai/response';
import { getBibleSuggestion } from '@/lib/ai/bible';
import prisma from '@/repositories/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, conversationId } = body ?? {};

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
    }

    const trimmed = message.trim();

    let conversation = conversationId
      ? await prisma.conversation.findUnique({
          where: { id: String(conversationId) },
          include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } },
        })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          title: trimmed.slice(0, 60) || 'Nova conversa',
        },
        include: { messages: true },
      });
    }

    const bibleSuggestion = await getBibleSuggestion(trimmed);
    const reply = await buildAssistantReply(trimmed, conversation.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })));

    const answer = bibleSuggestion
      ? `${reply.answer}\n\nVersículo sugerido: ${bibleSuggestion.reference} — ${bibleSuggestion.text}`
      : reply.answer;

    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          role: 'user',
          content: trimmed,
        },
        {
          conversationId: conversation.id,
          role: 'assistant',
          content: answer,
          sources: JSON.stringify(reply.sources.map((source) => ({
            title: source.title,
            source: source.source,
            url: 'url' in source ? source.url : undefined,
          }))),
        },
      ],
    });

    return NextResponse.json({
      answer,
      sources: reply.sources,
      verse: bibleSuggestion,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Erro no chat do agente:', error);
    return NextResponse.json(
      { error: 'Não foi possível processar a sua mensagem no momento.' },
      { status: 500 }
    );
  }
}
