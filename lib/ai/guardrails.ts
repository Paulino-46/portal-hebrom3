const ALLOWED_TOPICS = [
  'igreja adventista',
  'adventista',
  'adventismo',
  'cristianismo',
  'jesus',
  'jesucristo',
  'bíblia',
  'biblia',
  'versículo',
  'versiculo',
  'culto',
  'eventos',
  'evento',
  'notícias',
  'noticias',
  'noticia',
  'cronograma',
  'agenda',
  'programacao',
  'programação',
  'estudo bíblico',
  'estudo biblico',
  'igreja',
  'comunidade',
  'hebron',
  'hebrom iii',
  'história',
  'historia',
  'histórico',
  'historico',
  'trajetoria',
  'tradição',
  'tradicao',
  'missão',
  'missao',
  'dez mandamentos',
  'doutrina',
  'devocional',
  'oração',
  'oracao',
  'serviço',
  'servico',
  'portal',
  'jornal',
  'comunicado',
  'informação',
  'informacao',
  'acontece',
  'atividade',
  'atividades',
];

const BLOCKED_PATTERNS = [
  /\b(casino|bet|crypto|bitcoin|casino online|porn|sexo|adulto|gambling)\b/i,
  /\b(trump|politica|partido|eleicao|campanha|financas|investimento)\b/i,
  /\b(clima|meteorologia|previsao|rutina de treino|receita|programacao|marketing digital)\b/i,
];

export function isMessageWithinAllowedScope(message: string): boolean {
  const normalized = message.toLowerCase().trim();

  if (!normalized) {
    return false;
  }

  const hasAllowedTopic = ALLOWED_TOPICS.some((topic) => normalized.includes(topic));
  const hasBlockedPattern = BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized));

  if (hasBlockedPattern) {
    return false;
  }

  return hasAllowedTopic || normalized.length < 120;
}

export function getScopeGuardMessage(): string {
  return 'Posso responder apenas sobre a igreja adventista, a comunidade cristã, a Bíblia, cultos, eventos, notícias e ensino relacionado ao cristianismo. Se quiser, pergunte sobre estudos bíblicos, atividades da igreja, eventos ou mensagem espiritual.';
}
