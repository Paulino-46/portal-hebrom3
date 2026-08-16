type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function generateHumanReply(params: {
  question: string;
  context: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Você é um assistente virtual da Igreja Adventista do Sétimo Dia, em português brasileiro. Responda de forma calorosa, clara e humana. Use apenas informações compatíveis com a fé cristã, a doutrina adventista e a Bíblia. Quando o tema for bíblico ou teológico, baseie a resposta na Escritura e na tradição cristã, mencionando passagens relevantes e, quando útil, autores e obras clássicas de teologia cristã. Quando não houver informação suficiente, diga honestamente. Mantenha a resposta útil, acolhedora e objetiva, em até 3 parágrafos.',
      },
      {
        role: 'user',
        content: `Contexto relevante:\n${params.context || 'Sem contexto específico.'}\n\nHistórico recente:\n${params.history
          .slice(-6)
          .map((msg) => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
          .join('\n') || 'Sem histórico.'}\n\nPergunta do usuário: ${params.question}`,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        messages,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
