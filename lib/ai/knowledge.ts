import prisma from '@/repositories/prisma';

export type KnowledgeItem = {
  source: 'db' | 'api' | 'static';
  title: string;
  summary: string;
  content: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function getCommunityKnowledge(): Promise<KnowledgeItem[]> {
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    return [
      {
        source: 'static',
        title: 'Escopo autorizado',
        summary: 'O agente responde apenas sobre assuntos ligados à igreja adventista e ao cristianismo.',
        content: 'Respostas focadas em Bíblia, fé cristã, eventos e atividades da igreja, doutrina adventista e apoio espiritual da comunidade.',
      },
      {
        source: 'static',
        title: 'Fundamentos da Igreja Adventista',
        summary: 'A Igreja Adventista ensina a Bíblia como autoridade, Jesus como Salvador e a preparação para a segunda vinda.',
        content: 'A Igreja Adventista do Sétimo Dia valoriza a Bíblia como guia espiritual, a graça de Jesus Cristo como centro da mensagem, a adoração consciente, a missão evangelística, a saúde integral e a esperança na segunda vinda de Cristo.',
        metadata: { kind: 'credo' },
      },
      {
        source: 'static',
        title: 'Crenças cristãs essenciais',
        summary: 'Base bíblica para fé, oração, evangelismo, família e serviço comunitário.',
        content: 'O cristianismo centraliza a fé em Deus Pai, em Jesus Cristo e no Espírito Santo. A Bíblia é a Palavra de Deus, a salvação é pela graça mediante a fé, e os crentes são chamados a viver em amor, justiça, serviço e testemunho.',
        metadata: { kind: 'faith' },
      },
    ];
  }

  try {
    const [news, events, cronograma] = await Promise.all([
      prisma.news.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.event.findMany({ orderBy: { date: 'asc' }, take: 5 }),
      prisma.cronograma.findMany({ orderBy: { date: 'asc' }, take: 5 }),
    ]);

    const dbItems: KnowledgeItem[] = [
      ...news.map((item) => ({
        source: 'db' as const,
        title: item.title,
        summary: item.summary,
        content: `${item.title} - ${item.content}`,
        metadata: { kind: 'news', author: item.author, createdAt: item.createdAt.toISOString() },
      })),
      ...events.map((item) => ({
        source: 'db' as const,
        title: item.title,
        summary: item.description,
        content: `${item.title} - ${item.description} - ${item.location}`,
        metadata: { kind: 'event', location: item.location, date: item.date.toISOString() },
      })),
      ...cronograma.map((item) => ({
        source: 'db' as const,
        title: item.title,
        summary: item.description ?? item.details ?? 'Atividade da igreja',
        content: `${item.title} - ${item.description ?? item.details ?? ''} - ${item.speaker ?? ''}`,
        metadata: { kind: 'schedule', speaker: item.speaker ?? '', day: item.day, type: item.type },
      })),
    ];

    return [
      ...dbItems,
      {
        source: 'static',
        title: 'Fundamentos da Igreja Adventista',
        summary: 'A Igreja Adventista ensina a Bíblia como autoridade, Jesus como Salvador e a preparação para a segunda vinda.',
        content: 'A Igreja Adventista do Sétimo Dia valoriza a Bíblia como guia espiritual, a graça de Jesus Cristo como centro da mensagem, a adoração consciente, a missão evangelística, a saúde integral e a esperança na segunda vinda de Cristo.',
        metadata: { kind: 'credo' },
      },
      {
        source: 'static',
        title: 'Crenças cristãs essenciais',
        summary: 'Base bíblica para fé, oração, evangelismo, família e serviço comunitário.',
        content: 'O cristianismo centraliza a fé em Deus Pai, em Jesus Cristo e no Espírito Santo. A Bíblia é a Palavra de Deus, a salvação é pela graça mediante a fé, e os crentes são chamados a viver em amor, justiça, serviço e testemunho.',
        metadata: { kind: 'faith' },
      },
      {
        source: 'static',
        title: 'História da Igreja Adventista',
        summary: 'A Igreja Adventista nasceu no século XIX e se desenvolveu com foco em fé, educação, saúde e missão.',
        content: 'A Igreja Adventista do Sétimo Dia nasceu em um movimento espiritual do século XIX, marcado pela busca de uma vida íntegra, pela guarda do sábado, pela saúde e pelo serviço. Sua herança inspirou educação, ação social e missão global, sendo uma tradição de fé com forte vínculo com a Bíblia e com a esperança da segunda vinda de Cristo.',
        metadata: { kind: 'history' },
      },
      {
        source: 'static',
        title: 'História de Hebrom III',
        summary: 'Hebrom III é uma comunidade local que cresceu com culto, estudos bíblicos e ações de serviço em favor das famílias.',
        content: 'Hebrom III nasceu do desejo de construir um espaço de adoração e apoio mútuo. Com cultos dedicados, encontros familiares, estudos bíblicos e projetos sociais, a comunidade se fortaleceu como ponto de referência para quem busca fé, esperança e comunhão. Hoje, a igreja investe em formação espiritual, cuidado com as famílias e presença ativa na região.',
        metadata: { kind: 'community' },
      },
      {
        source: 'static',
        title: 'Eventos e cronograma da comunidade',
        summary: 'A comunidade organizada com cultos, estudos, eventos e atividades do calendário local.',
        content: 'A vida da comunidade é organizada por cultos semanais, estudos bíblicos, encontros familiares, eventos especiais e ações de serviço. O cronograma ajuda membros e visitantes a conhecer as atividades, manter a rotina espiritual e participar da missão local da igreja.',
        metadata: { kind: 'schedule' },
      },
    ];
  } catch (error) {
    console.error('Erro ao carregar conhecimento do agente:', error);
    return [
      {
        source: 'static',
        title: 'Escopo autorizado',
        summary: 'O agente responde apenas sobre assuntos ligados à igreja adventista e ao cristianismo.',
        content: 'Respostas focadas em Bíblia, fé cristã, eventos e atividades da igreja, doutrina adventista e apoio espiritual da comunidade.',
      },
    ];
  }
}

export async function getBibleReferenceContext(question: string): Promise<string> {
  const normalized = question.toLowerCase();

  if (normalized.includes('oração') || normalized.includes('oracao')) {
    return 'A oração é um hábito central para o cristão, com base em 1 Tessalonicenses 5:17 e Filipenses 4:6-7.';
  }

  if (normalized.includes('amor') || normalized.includes('família') || normalized.includes('familia')) {
    return 'O amor e a família são temas centrais no cristianismo, com base em 1 Coríntios 13 e Efésios 6:1-4.';
  }

  if (normalized.includes('esperança') || normalized.includes('segunda vinda') || normalized.includes('segunda vinda')) {
    return 'A esperança cristã na segunda vinda de Jesus é uma doutrina central, fundamentada em 1 Tessalonicenses 4:16-17 e Tiago 5:8.';
  }

  if (normalized.includes('saúde') || normalized.includes('bem estar') || normalized.includes('saude')) {
    return 'A saúde integral é um valor estimado no adventismo, associado à sabedoria de 1 Coríntios 6:19-20 e 3 João 1:2.';
  }

  return 'A Bíblia é a base da fé cristã e a Igreja Adventista reconhece as Escrituras como guia para a vida espiritual, moral e comunitária.';
}

export function getTheologicalReferenceContext(question: string): string {
  const normalized = question.toLowerCase();

  const topicReferences: Array<{ matcher: RegExp; text: string }> = [
    {
      matcher: /(oração|oracao|oração e poder|clamação)/,
      text: 'Para oração e intimidade com Deus, a análise considera Mateus 6:5-15, 1 Tessalonicenses 5:17 e a tradição sobre oração, renúncia e dependência de Deus. Obras clássicas de referência incluem A Doutrina Cristã e Teologia Sistemática.',
    },
    {
      matcher: /(pecado|salvacao|salvação|graça|graca|justificacao|justificação)/,
      text: 'Para pecado, graça e salvação, a leitura se apoia em Romanos 3:23-24, Efésios 2:8-10 e a tradição teológica que explica a graça de Cristo como centro da redenção.',
    },
    {
      matcher: /(família|familia|casamento|relacionamento|amor)/,
      text: 'Para família e amor, a teologia cristã considera Efésios 5:25-33, Colossenses 3:12-17 e os princípios da relação humana sob o cuidado de Deus, com base na tradição moral cristã.',
    },
    {
      matcher: /(esperança|segunda vinda|segundo advento|fim dos tempos|escatologia)/,
      text: 'Para esperança e segunda vinda, a resposta considera 1 Tessalonicenses 4:13-18, Apocalipse 21 e a tradição adventista sobre o retorno de Cristo e a esperança final.',
    },
    {
      matcher: /(santificação|santificacao|vida cristã|moral|ética|etica)/,
      text: 'Para santificação e ética cristã, a análise usa Romanos 12, 1 Coríntios 10:31 e a reflexão teológica sobre viver conforme a vontade de Deus em todo aspecto da vida.',
    },
    {
      matcher: /(trindade|deus pai|jesus|espírito santo|espirito santo|cristologia)/,
      text: 'Para Cristo, Trindade e espiritualidade, a base teológica é a revelação bíblica em João 1, Mateus 28:19 e a tradição cristã sobre a pessoa e a obra de Jesus.',
    },
    {
      matcher: /(doutrina|teologia|ensino|sermão|estudo bíblico|estudo biblico)/,
      text: 'A resposta se apoia na Bíblia e em obras clássicas de teologia cristã, como Teologia Sistemática, A Doutrina Cristã e as reflexões dos reformadores e dos teólogos cristãos sobre fé, graça e prática espiritual.',
    },
  ];

  const chosen = topicReferences.find((item) => item.matcher.test(normalized));

  if (chosen) {
    return `Referência teológica: ${chosen.text}`;
  }

  return 'A resposta considera a Bíblia como autoridade, com apoio da tradição teológica cristã e de autores clássicos sobre doutrina, graça, santificação e espiritualidade, como Teologia Sistemática, A Doutrina Cristã e reflexões de teólogos reformadores e adventistas.';
}
