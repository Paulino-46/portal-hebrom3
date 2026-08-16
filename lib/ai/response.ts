import { retrieveStructuredContext } from './retriever';
import { getScopeGuardMessage, isMessageWithinAllowedScope } from './guardrails';
import { searchWebContext } from './web';
import { generateHumanReply } from './openai';

function cleanAnswer(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function formatNaturalAnswer(
  question: string,
  items: Array<{ title: string; summary: string; content: string; source?: string; url?: string }>,
  webItems: Array<{ title: string; summary: string; content: string; source: 'web'; url?: string }> = []
) {
  const normalizedQuestion = question.trim();
  const top = items[0] ?? webItems[0];

  if (!top) {
    return 'Claro! Posso ajudar com temas da fé cristã, da Igreja Adventista, cultos, eventos, notícias e estudos bíblicos. Me diga o assunto que você quer saber e eu te respondo com atenção ao contexto da igreja e da Bíblia.';
  }

  const isEventQuestion = /evento|culto|cronograma|agenda|programa|atividade|atividades/.test(normalizedQuestion.toLowerCase());
  const isNewsQuestion = /noticia|notícias|comunicado|atualidade|portal|acontece|informacao|informação/.test(normalizedQuestion.toLowerCase());
  const isHistoryQuestion = /historia|história|historico|histórico|trajetoria|origem|fundacao|fundação/.test(normalizedQuestion.toLowerCase());
  const isCommunityQuestion = /comunidade|hebron|hebrom|missao|missão|familia|família|servico|serviço/.test(normalizedQuestion.toLowerCase());
  const isBibleQuestion = /versiculo|versículo|bíblia|biblia|estudo|teologia|doutrina|salvacao|salvação|graca|graça|pecado|oração|oracao|romanos|epistola|epístola|contexto/.test(normalizedQuestion.toLowerCase());

  const lead = isEventQuestion
    ? `Claro! Pelo contexto da comunidade, ${top.title} está muito ligado a esse tema.`
    : isNewsQuestion
      ? `Claro! A informação mais relevante sobre isso é: ${top.summary}`
      : isHistoryQuestion
        ? `Claro! Sobre a história e a trajetória da comunidade, ${top.summary}`
        : isCommunityQuestion
          ? `Claro! No contexto da comunidade Hebrom III, ${top.summary}`
          : isBibleQuestion
            ? `Claro! Com base na Escritura e na tradição teológica cristã, ${top.summary}`
            : `Claro! Com base na fé cristã e no contexto da Igreja Adventista, ${top.summary}`;

  const body = (top.content ?? '').length > 260
    ? `${(top.content ?? '').slice(0, 260).trim()}...`
    : top.content ?? '';

  const extra = items.length > 1 || webItems.length > 0
    ? ` Também vale considerar ${((items[1] ?? webItems[0])?.title ?? 'o contexto da comunidade')} como apoio para a resposta.`
    : ' Isso está alinhado com a doutrina e com a vivência cristã da comunidade.';

  return cleanAnswer(`${lead} ${body}.${extra}`);
}

export async function buildAssistantReply(question: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = []) {
  if (!isMessageWithinAllowedScope(question)) {
    return {
      answer: getScopeGuardMessage(),
      sources: [],
    };
  }

  const localItems = await retrieveStructuredContext(question);
  const webItems = !localItems.length ? await searchWebContext(question, 2) : [];

  const mergedItems = [...localItems, ...webItems.map((item) => ({
    title: item.title,
    summary: item.summary,
    content: item.content,
    source: item.source,
    url: item.url,
  }))];

  const finalItems = mergedItems.slice(0, 5);

  if (!finalItems.length) {
    return {
      answer: 'Claro! Posso responder com atenção sobre Igreja Adventista, Bíblia, cultos, eventos, notícias e ensinamentos cristãos. Me diga mais sobre o tema e eu te ajudo com uma resposta mais completa.',
      sources: [],
    };
  }

  const response = formatNaturalAnswer(question, finalItems, webItems);

  const contextForHistory = history.length
    ? `Histórico da conversa: ${history.map((msg) => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`).slice(-5).join(' | ')}`
    : '';

  const contextText = finalItems.map((item) => `[${item.source || 'base'}] ${item.title}: ${item.content}`).join('\n\n');

  const openAiAnswer = await generateHumanReply({
    question,
    context: contextText,
    history,
  });

  const refinedAnswer = openAiAnswer
    ? cleanAnswer(openAiAnswer)
    : `${response}${contextForHistory ? ` ${contextForHistory.slice(0, 220)}.` : ''}`;

  return {
    answer: refinedAnswer,
    sources: finalItems,
  };
}
