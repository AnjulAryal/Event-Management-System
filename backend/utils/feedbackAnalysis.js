const positiveTerms = [
  'amazing',
  'brilliant',
  'clear',
  'excellent',
  'fantastic',
  'good',
  'great',
  'helpful',
  'high quality',
  'smooth',
  'strong',
  'useful',
  'well received',
  'organized',
  'enjoyed',
  'informative',
  'nice',
  'satisfied',
  'valuable',
];

const negativeTerms = [
  'bad',
  'confusing',
  'disorganized',
  'heat',
  'inconsistent',
  'late',
  'mess',
  'poorly',
  'problem',
  'queue',
  'slow',
  'terrible',
  'unorganized',
  'waited',
  'wifi',
  'worst',
];

const neutralPhrasePatterns = [
  /\bneither\s+(?:really\s+)?good\s+(?:nor|or|not)\s+(?:really\s+)?bad\b/,
  /\bnot\s+good\s*(?:,|and|or)?\s*not\s+bad\b/,
  /\bnot\s+bad\s*(?:,|and|or)?\s*not\s+good\b/,
  /\bneutral\b/,
  /\baverage\b/,
  /\bno\s+(?:strong\s+)?(?:opinion|complaints|issues)\b/,
];

const negativeMeaningPatterns = [
  /\bnot\s+(?:good|great|helpful|clear|useful|organized|informative|smooth|valuable)\b/,
  /\bnot\s+well\s+(?:received|organized|run)\b/,
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getTermPattern = (term) => (
  new RegExp(`\\b${term.trim().split(/\s+/).map(escapeRegExp).join('\\s+')}\\b`)
);

const scoreTerms = (terms, text) => (
  terms.filter((term) => getTermPattern(term).test(text)).length
);

const stripNegatedTerms = (text, terms) => (
  terms.reduce((currentText, term) => {
    const pattern = new RegExp(`\\b(?:not|no|never|hardly|isn['’]?t|wasn['’]?t|without)\\s+${term.trim().split(/\s+/).map(escapeRegExp).join('\\s+')}\\b`, 'g');
    return currentText.replace(pattern, ' ');
  }, text)
);

const themeDefinitions = [
  { label: 'Content Quality', keywords: ['workshop', 'session', 'breakout', 'demo', 'content', 'topic', 'material', 'presentation'] },
  { label: 'Speaker Quality', keywords: ['speaker', 'keynote', 'panel', 'host', 'presenter', 'facilitator'] },
  { label: 'Registration Flow', keywords: ['registration', 'check-in', 'check in', 'queue', 'ticket', 'entry', 'booking'] },
  { label: 'Event Management', keywords: ['event management', 'management', 'organization', 'organised', 'organized', 'unorganized', 'disorganized', 'logistical', 'planning', 'coordination'] },
  { label: 'Venue & Logistics', keywords: ['venue', 'hall', 'parking', 'layout', 'space', 'location', 'room', 'seating'] },
  { label: 'Connectivity & Tech', keywords: ['wifi', 'wi-fi', 'network', 'app', 'audio', 'sound', 'mic', 'projector', 'screen'] },
  { label: 'Schedule & Timing', keywords: ['late', 'delay', 'schedule', 'time', 'timing', 'started', 'ended', 'waited'] },
  { label: 'Food & Hospitality', keywords: ['food', 'lunch', 'snack', 'meal', 'refreshment', 'staff', 'hospitality'] },
  { label: 'Networking Experience', keywords: ['networking', 'connections', 'people', 'meet', 'community'] },
];

const getSentiment = (feedback) => {
  const text = String(feedback.feedback || '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (neutralPhrasePatterns.some((pattern) => pattern.test(text))) return 'neutral';

  if (Number(feedback.rating) >= 4) return 'positive';
  if (Number(feedback.rating) <= 2) return 'negative';

  const positiveScore = scoreTerms(positiveTerms, stripNegatedTerms(text, positiveTerms));
  const negativeScanText = stripNegatedTerms(text, negativeTerms);
  const hasNegatedNegative = negativeScanText !== text;
  const negativeScore = scoreTerms(negativeTerms, negativeScanText)
    + negativeMeaningPatterns.filter((pattern) => pattern.test(text)).length;

  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  if (hasNegatedNegative) return 'neutral';
  return 'neutral';
};

const isEventFeedback = (feedback) => {
  const title = String(feedback.title || '').trim();
  if (!title) return false;

  return !title.toLowerCase().startsWith('support:');
};

const getDateValue = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatPercent = (count, total) => {
  if (!total) return 0;
  return Math.round((count / total) * 100);
};

const getDominantSentiment = (items) => {
  const counts = {
    positive: items.filter((item) => item.sentiment === 'positive').length,
    neutral: items.filter((item) => item.sentiment === 'neutral').length,
    negative: items.filter((item) => item.sentiment === 'negative').length,
  };

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
};

const analyzeThemes = (items) => {
  if (!items.length) return [];

  return themeDefinitions
    .map((theme) => {
      const matchedItems = items.filter((item) => {
        const text = `${item.feedback || ''} ${item.title || ''}`.toLowerCase();
        return theme.keywords.some((keyword) => text.includes(keyword));
      });

      return {
        label: theme.label,
        keywords: theme.keywords,
        sentiment: getDominantSentiment(matchedItems),
        count: matchedItems.length,
        percent: formatPercent(matchedItems.length, items.length),
      };
    })
    .filter((theme) => theme.count > 0)
    .sort((a, b) => b.count - a.count || b.percent - a.percent)
    .slice(0, 3);
};

const compactText = (text, maxLength = 115) => {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 3).trim()}...`;
};

const reviewLine = (prefix, review) => `${prefix}: "${compactText(review.feedback)}"`;

const uniqueLines = (lines) => [...new Set(lines.filter(Boolean))].slice(0, 3);

const createFallbackSummary = (eventName, items, themes) => {
  if (!items.length) {
    return { right: [], wrong: [], future: [] };
  }

  const positive = items.filter((item) => item.sentiment === 'positive');
  const neutral = items.filter((item) => item.sentiment === 'neutral');
  const negative = items.filter((item) => item.sentiment === 'negative');
  const issueThemes = themes.filter((theme) => theme.sentiment === 'negative');

  const right = uniqueLines([
    ...positive.map((review) => reviewLine('Positive attendee note', review)),
  ]);

  const wrong = uniqueLines(negative.map((review) => reviewLine('Issue reported', review)));

  const future = uniqueLines([
    ...issueThemes.map((theme) => `Review ${theme.label.toLowerCase()} for ${eventName}; ${theme.count} review${theme.count === 1 ? ' mentions' : 's mention'} this area.`),
    ...negative.map((review) => `Follow up on this reported issue: "${compactText(review.feedback, 90)}"`),
    ...(!issueThemes.length && neutral.length ? neutral.map((review) => `Clarify this mixed feedback before the next event: "${compactText(review.feedback, 90)}"`) : []),
  ]);

  return { right, wrong, future };
};

const buildEventAnalyses = (feedbacks) => {
  const enriched = feedbacks.filter(isEventFeedback).map((item) => ({
    id: item._id,
    title: item.title || 'Untitled Event',
    email: item.email,
    date: item.date,
    feedback: item.feedback,
    rating: item.rating,
    createdAt: item.createdAt,
    sentiment: getSentiment(item),
  }));

  const grouped = enriched.reduce((acc, item) => {
    if (!acc[item.title]) acc[item.title] = [];
    acc[item.title].push(item);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([title, items]) => {
      const sorted = [...items].sort((a, b) => getDateValue(b.date || b.createdAt) - getDateValue(a.date || a.createdAt));
      const counts = {
        positive: items.filter((item) => item.sentiment === 'positive').length,
        neutral: items.filter((item) => item.sentiment === 'neutral').length,
        negative: items.filter((item) => item.sentiment === 'negative').length,
      };
      const total = items.length;
      const themes = analyzeThemes(items);

      return {
        title,
        date: sorted[0]?.date || 'Upcoming',
        total,
        percentages: {
          positive: formatPercent(counts.positive, total),
          neutral: formatPercent(counts.neutral, total),
          negative: formatPercent(counts.negative, total),
        },
        themes,
        summary: createFallbackSummary(title, items, themes),
        reviews: sorted,
      };
    })
    .sort((a, b) => getDateValue(b.date) - getDateValue(a.date));
};

const buildAiPrompt = (events) => `
You are helping an event admin understand attendee feedback.
Return only valid JSON. Do not include markdown.

For each event below, write a grounded summary using only the provided reviews.
Rules:
- Do not invent issues, praise, themes, or recommendations.
- If there is no evidence for a section, return an empty array for that section.
- Use specific wording from the feedback data where possible.
- Keep each bullet concise and event-specific.
- Never reuse the same generic summary across different events.
- Treat neutral reviews as neutral or mixed, not as complaints.
- Phrases like "neither good nor bad", "neither good not bad", or "not bad" are neutral unless the review also states a concrete problem.
- Put items in "wrong" only when the review explicitly reports a problem, complaint, or negative experience.

Keep this exact schema:
{
  "events": [
    {
      "title": "Event name",
      "summary": {
        "right": ["three concise bullets"],
        "wrong": ["three concise bullets"],
        "future": ["three concise bullets"]
      }
    }
  ]
}

Feedback analytics:
${JSON.stringify(
  events.map((event) => ({
    title: event.title,
    sentiment: event.percentages,
    themes: event.themes,
    totalReviews: event.total,
    reviews: event.reviews.slice(0, 8).map((review) => ({
      rating: review.rating,
      sentiment: review.sentiment,
      feedback: review.feedback,
    })),
  })),
)}
`;

const extractGeminiText = (data) => (
  data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim() || ''
);

const parseJsonResponse = (text) => {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(cleaned);
};

const sanitizeSummaryList = (value, fallback = []) => {
  if (!Array.isArray(value)) return fallback;

  return value
    .map((item) => String(item || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 3);
};

const applyAiSummaries = (events, aiData) => {
  if (!Array.isArray(aiData?.events)) return events;

  return events.map((event) => {
    const aiEvent = aiData.events.find((item) => item.title === event.title);
    if (!aiEvent?.summary) return event;

    return {
      ...event,
      summary: {
        right: sanitizeSummaryList(aiEvent.summary.right, event.summary.right),
        wrong: sanitizeSummaryList(aiEvent.summary.wrong, event.summary.wrong),
        future: sanitizeSummaryList(aiEvent.summary.future, event.summary.future),
      },
    };
  });
};

const generateGeminiSummaries = async (events) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { events, provider: 'local-fallback' };
  if (events.length === 0) return { events, provider: 'local-fallback' };

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 8000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildAiPrompt(events) }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    })
    .finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${details}`);
  }

  const data = await response.json();
  const text = extractGeminiText(data);
  const aiData = parseJsonResponse(text);

  return {
    events: applyAiSummaries(events, aiData),
    provider: `gemini:${model}`,
  };
};

module.exports = {
  buildEventAnalyses,
  generateGeminiSummaries,
  isEventFeedback,
};
