import { getCommunityKnowledge, getBibleReferenceContext, type KnowledgeItem } from './knowledge';

function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function retrieveRelevantContext(question: string): Promise<string> {
  const knowledge = await getCommunityKnowledge();
  const normalizedQuestion = normalizeText(question);

  const scored = knowledge
    .map((item) => {
      const haystack = normalizeText(`${item.title} ${item.summary} ${item.content}`);
      let score = 0;

      for (const word of normalizedQuestion.split(/\s+/)) {
        if (!word || word.length < 3) continue;
        if (haystack.includes(word)) score += 2;
      }

      const kind = item.metadata?.kind;

      if (kind === 'event' && /(eventos|culto|cronograma|agenda|atividade|atividades|programacao|programação)/.test(normalizedQuestion)) {
        score += 5;
      }

      if (kind === 'news' && /(noticia|noticias|comunicado|atualidade|portal|informacao|informação)/.test(normalizedQuestion)) {
        score += 5;
      }

      if (kind === 'schedule' && /(cronograma|agenda|programacao|programação|evento|culto|atividade|atividades)/.test(normalizedQuestion)) {
        score += 6;
      }

      if (kind === 'history' && /(historia|historico|história|trajetoria|tradicao|tradição|origem|fundacao|fundação)/.test(normalizedQuestion)) {
        score += 6;
      }

      if (kind === 'community' && /(comunidade|hebron|hebrom|missao|missão|servico|serviço|familia|familiar)/.test(normalizedQuestion)) {
        score += 5;
      }

      if (kind === 'credo' || kind === 'faith') {
        if (/doutrina|cristianismo|fe|igreja|adventista|biblia|jesus|salvacao|salvação/.test(normalizedQuestion)) {
          score += 4;
        }
      }

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 4).map((entry) => entry.item);
  const context = top.length
    ? top.map((item) => `- ${item.title}: ${item.summary}. ${item.content}`).join('\n')
    : 'Sem contexto específico no banco neste momento.';

  return `${context}\n\nReferência bíblica geral: ${await getBibleReferenceContext(question)}`;
}

export type RetrievalResult = {
  source: KnowledgeItem['source'];
  title: string;
  summary: string;
  content: string;
};

export async function retrieveStructuredContext(question: string): Promise<RetrievalResult[]> {
  const knowledge = await getCommunityKnowledge();
  const normalizedQuestion = normalizeText(question);

  return knowledge
    .map((item) => {
      const haystack = normalizeText(`${item.title} ${item.summary} ${item.content}`);
      let score = 0;

      for (const word of normalizedQuestion.split(/\s+/)) {
        if (!word || word.length < 3) continue;
        if (haystack.includes(word)) score += 2;
      }

      const kind = item.metadata?.kind;
      if (kind === 'event' && /(eventos|culto|cronograma|agenda|atividade|atividades|programacao|programação)/.test(normalizedQuestion)) score += 5;
      if (kind === 'news' && /(noticia|noticias|comunicado|atualidade|portal|informacao|informação)/.test(normalizedQuestion)) score += 5;
      if (kind === 'schedule' && /(cronograma|agenda|programacao|programação|evento|culto|atividade|atividades)/.test(normalizedQuestion)) score += 6;
      if (kind === 'history' && /(historia|historico|história|trajetoria|tradicao|tradição|origem|fundacao|fundação)/.test(normalizedQuestion)) score += 6;
      if (kind === 'community' && /(comunidade|hebron|hebrom|missao|missão|servico|serviço|familia|familiar)/.test(normalizedQuestion)) score += 5;
      if ((kind === 'credo' || kind === 'faith') && /(doutrina|cristianismo|fe|igreja|adventista|biblia|jesus|salvacao|salvação)/.test(normalizedQuestion)) score += 4;

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ item }) => ({
      source: item.source,
      title: item.title,
      summary: item.summary,
      content: item.content,
    }));
}
