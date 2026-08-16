import { NextResponse } from 'next/server';
import { buildAssistantReply } from '@/lib/ai/response';
import { getBibleSuggestion } from '@/lib/ai/bible';
import prisma from '@/repositories/prisma';

async function getConversationContext(message: string, conversationId?: string | null) {
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    return { conversation: null, history: [] as Array<{ role: 'user' | 'assistant'; content: string }> };
  }

  try {
    let conversation = conversationId
      ? await prisma.conversation.findUnique({
          where: { id: String(conversationId) },
          include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } },
        })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          title: message.slice(0, 60) || 'Nova conversa',
        },
        include: { messages: true },
      });
    }

    return {
      conversation,
      history: conversation.messages.map((msg): { role: 'user' | 'assistant'; content: string } => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    };
  } catch (error) {
    console.warn('Banco de dados indisponível para o chat; seguindo sem persistência.', error);
    return { conversation: null, history: [] as Array<{ role: 'user' | 'assistant'; content: string }> };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, conversationId } = body ?? {};

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
    }

    const trimmed = message.trim();
    const { conversation, history } = await getConversationContext(trimmed, conversationId);

    const bibleSuggestion = await getBibleSuggestion(trimmed);
    const reply = await buildAssistantReply(trimmed, history);

    const answer = bibleSuggestion
      ? `${reply.answer}\n\nVersículo sugerido: ${bibleSuggestion.reference} — ${bibleSuggestion.text}`
      : reply.answer;

    if (conversation && process.env.DATABASE_URL) {
      try {
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
      } catch (error) {
        console.warn('Não foi possível salvar a conversa no banco. Resposta continua disponível sem histórico.', error);
      }
    }

    return NextResponse.json({
      answer,
      sources: reply.sources,
      verse: bibleSuggestion,
      conversationId: conversation?.id ?? undefined,
    });
  } catch (error) {
    console.error('Erro no chat do agente:', error);
    return NextResponse.json(
      { error: 'Não foi possível processar a sua mensagem no momento.' },
      { status: 500 }
    );
  }
}
