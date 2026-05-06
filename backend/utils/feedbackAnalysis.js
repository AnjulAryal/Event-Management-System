const positiveTerms = [
  'amazing',
  'brilliant',
  'clear',
  'excellent',
  'fantastic',
  'great',
  'helpful',
  'high quality',
  'smooth',
  'strong',
  'useful',
  'well received',
];

const negativeTerms = [
  'bad',
  'confusing',
  'heat',
  'inconsistent',
  'late',
  'poorly',
  'queue',
  'slow',
  'waited',
  'wifi',
];

const themeDefinitions = [
  { label: 'Workshop Quality', keywords: ['workshop', 'session', 'breakout', 'demo'], sentiment: 'positive' },
  { label: 'Speaker Quality', keywords: ['speaker', 'keynote', 'panel'], sentiment: 'positive' },
  { label: 'Registration Flow', keywords: ['registration', 'check-in', 'queue'], sentiment: 'neutral' },
  { label: 'On-site Wi-Fi', keywords: ['wifi', 'network', 'app'], sentiment: 'negative' },
  { label: 'Venue Management', keywords: ['venue', 'hall', 'parking', 'layout'], sentiment: 'negative' },
];

const getSentiment = (feedback) => {
  if (Number(feedback.rating) >= 4) return 'positive';
  if (Number(feedback.rating) <= 2) return 'negative';

  const text = String(feedback.feedback || '').toLowerCase();
  const positiveScore = positiveTerms.filter((term) => text.includes(term)).length;
  const negativeScore = negativeTerms.filter((term) => text.includes(term)).length;

  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
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

const analyzeThemes = (items) => {
  const total = Math.max(items.length, 1);

  return themeDefinitions
    .map((theme) => {
      const matches = items.filter((item) => {
        const text = `${item.feedback || ''} ${item.title || ''}`.toLowerCase();
        return theme.keywords.some((keyword) => text.includes(keyword));
      }).length;

      return {
        ...theme,
        percent: Math.min(95, Math.max(matches ? Math.round((matches / total) * 88) : 0, matches ? 38 : 0)),
      };
    })
    .filter((theme) => theme.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
};

const createFallbackSummary = (eventName, items, themes) => {
  const positive = items.filter((item) => item.sentiment === 'positive');
  const negative = items.filter((item) => item.sentiment === 'negative');

  const topPositiveTheme = themes.find((theme) => theme.sentiment === 'positive')?.label || 'speaker and session quality';
  const topConcernTheme = themes.find((theme) => theme.sentiment === 'negative')?.label || 'onsite operations';
  const topNeutralTheme = themes.find((theme) => theme.sentiment === 'neutral')?.label || 'registration flow';

  return {
    right: [
      `${topPositiveTheme} was consistently praised across attendee responses.`,
      positive.length
        ? `${positive.length} review${positive.length === 1 ? '' : 's'} mention strong value from the event experience.`
        : 'Positive notes highlight useful sessions and practical takeaways.',
      'Networking opportunities were well received by attendees.',
    ],
    wrong: [
      `${topConcernTheme} created friction for several attendees.`,
      negative.length
        ? `${negative.length} negative review${negative.length === 1 ? '' : 's'} need operational follow-up.`
        : 'A few comments point to small onsite coordination issues.',
      `${topNeutralTheme} should be watched because it appears in mixed feedback.`,
    ],
    future: [
      `Improve crowd-flow management for ${eventName}.`,
      'Upgrade venue Wi-Fi infrastructure before the next event.',
      'Simplify the registration and booking process for users.',
    ],
  };
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

For each event below, improve the summary while keeping the same schema:
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

const applyAiSummaries = (events, aiData) => {
  if (!Array.isArray(aiData?.events)) return events;

  return events.map((event) => {
    const aiEvent = aiData.events.find((item) => item.title === event.title);
    if (!aiEvent?.summary) return event;

    return {
      ...event,
      summary: {
        right: Array.isArray(aiEvent.summary.right) ? aiEvent.summary.right.slice(0, 3) : event.summary.right,
        wrong: Array.isArray(aiEvent.summary.wrong) ? aiEvent.summary.wrong.slice(0, 3) : event.summary.wrong,
        future: Array.isArray(aiEvent.summary.future) ? aiEvent.summary.future.slice(0, 3) : event.summary.future,
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
