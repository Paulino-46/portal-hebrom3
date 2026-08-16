type WebSearchItem = {
  title: string;
  summary: string;
  content: string;
  source: 'web';
  url?: string;
};

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchPageText(url: string): Promise<string> {
  if (!url) return '';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      cache: 'no-store',
    });

    if (!response.ok) return '';

    const html = await response.text();
    return stripHtml(html).slice(0, 1600);
  } catch {
    return '';
  }
}

export async function searchWebContext(question: string, maxResults = 3): Promise<WebSearchItem[]> {
  const query = question.trim();
  if (!query) return [];

  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    const candidates: Array<{ title: string; url: string; snippet: string }> = [];

    if (data?.AbstractText) {
      candidates.push({
        title: data?.Heading || 'Resumo da web',
        url: data?.AbstractURL || '',
        snippet: data.AbstractText,
      });
    }

    const relatedTopics = Array.isArray(data?.RelatedTopics) ? data.RelatedTopics : [];

    for (const item of relatedTopics) {
      const resultText = typeof item?.Result === 'string' ? item.Result : '';
      const firstUrl = item?.FirstURL || '';
      const text = item?.Text || resultText || '';

      if (firstUrl && text) {
        const cleanTitle = stripHtml(resultText || text).slice(0, 80) || 'Resultado da web';
        candidates.push({ title: cleanTitle, url: firstUrl, snippet: stripHtml(text).slice(0, 200) });
      }
    }

    const unique = Array.from(new Map(candidates.filter(item => !!item.url).map(item => [item.url, item])).values());
    const results: WebSearchItem[] = [];

    for (const item of unique.slice(0, maxResults)) {
      const pageText = await fetchPageText(item.url);
      const content = pageText || item.snippet;

      if (!content) continue;

      results.push({
        title: item.title || 'Resultado da web',
        summary: item.snippet || content.slice(0, 180),
        content: content.slice(0, 1400),
        source: 'web',
        url: item.url,
      });
    }

    return results;
  } catch {
    return [];
  }
}
