import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Frown,
    Leaf,
    Meh,
    MessageCircle,
    Search,
    Smile,
    Sparkles,
    Star,
    TrendingUp,
    Trophy,
    Wifi,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const sentimentConfig = {
    positive: {
        label: 'Positive',
        cardLabel: 'Positive Sentiment',
        color: '#5CB85C',
        text: 'text-[#4AA14A]',
        bg: 'bg-green-50',
        Icon: Smile,
    },
    neutral: {
        label: 'Neutral',
        cardLabel: 'Neutral Sentiment',
        color: '#D6A800',
        text: 'text-[#9C7A00]',
        bg: 'bg-amber-50',
        Icon: Meh,
    },
    negative: {
        label: 'Negative',
        cardLabel: 'Negative Sentiment',
        color: '#D01F1F',
        text: 'text-[#C63636]',
        bg: 'bg-red-50',
        Icon: Frown,
    },
};

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

const stripNegatedNegativeTerms = (text) => (
    negativeTerms.reduce((currentText, term) => {
        const pattern = new RegExp(`\\b(?:not|no|never|hardly|isn['’]?t|wasn['’]?t|without)\\s+${term.trim().split(/\s+/).map(escapeRegExp).join('\\s+')}\\b`, 'g');
        return currentText.replace(pattern, ' ');
    }, text)
);

const stripNegatedPositiveTerms = (text) => (
    positiveTerms.reduce((currentText, term) => {
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

const eventIcons = [TrendingUp, Leaf, MessageCircle, Trophy];

const getSentiment = (feedback) => {
    const text = String(feedback.feedback || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const isBalancedNeutral = neutralPhrasePatterns.some((pattern) => pattern.test(text));
    if (isBalancedNeutral) return 'neutral';

    if (Number(feedback.rating) >= 4) return 'positive';
    if (Number(feedback.rating) <= 2) return 'negative';

    const positiveScore = scoreTerms(positiveTerms, stripNegatedPositiveTerms(text));
    const negativeScanText = stripNegatedNegativeTerms(text);
    const hasNegatedNegative = negativeScanText !== text;
    const negativeScore = scoreTerms(negativeTerms, negativeScanText)
        + negativeMeaningPatterns.filter((pattern) => pattern.test(text)).length;

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    if (hasNegatedNegative) return 'neutral';
    return 'neutral';
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

const getInitials = (email = '') => {
    const local = email.split('@')[0] || 'guest';
    return local
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'AB';
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

const createSummary = (eventName, items, themes) => {
    if (!items.length) {
        return { right: [], wrong: [], future: [] };
    }

    const positive = items.filter((item) => item.sentiment === 'positive');
    const negative = items.filter((item) => item.sentiment === 'negative');
    const neutral = items.filter((item) => item.sentiment === 'neutral');

    const compactText = (text, maxLength = 115) => {
        const normalized = String(text || '').replace(/\s+/g, ' ').trim();
        if (normalized.length <= maxLength) return normalized;
        return `${normalized.slice(0, maxLength - 3).trim()}...`;
    };

    const uniqueLines = (lines) => [...new Set(lines.filter(Boolean))].slice(0, 3);
    const issueThemes = themes.filter((theme) => theme.sentiment === 'negative');

    return {
        right: uniqueLines(positive.map((review) => `Positive attendee note: "${compactText(review.feedback)}"`)),
        wrong: uniqueLines(negative.map((review) => `Issue reported: "${compactText(review.feedback)}"`)),
        future: uniqueLines([
            ...issueThemes.map((theme) => `Review ${theme.label.toLowerCase()} for ${eventName}; ${theme.count} review${theme.count === 1 ? ' mentions' : 's mention'} this area.`),
            ...negative.map((review) => `Follow up on this reported issue: "${compactText(review.feedback, 90)}"`),
            ...(!issueThemes.length && neutral.length ? neutral.map((review) => `Clarify this mixed feedback before the next event: "${compactText(review.feedback, 90)}"`) : []),
        ]),
    };
};

const SentimentBar = ({ type, percent }) => {
    const config = sentimentConfig[type];

    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
                <span className={config.text}>{config.label}</span>
                <span className="text-slate-700">{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: config.color }}
                />
            </div>
        </div>
    );
};

const SentimentStatCard = ({ type, percent }) => {
    const config = sentimentConfig[type];
    const Icon = config.Icon;

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">{config.cardLabel}</p>
                    <p className="mt-2 text-3xl font-extrabold leading-none text-slate-900">{percent}%</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config.bg}`}>
                    <Icon className={config.text} size={23} />
                </div>
            </div>
        </div>
    );
};

const RatingStars = ({ rating }) => (
    <div className="flex items-center justify-end gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={14}
                className={star <= Math.round(Number(rating) || 0) ? 'fill-[#E6A700] text-[#E6A700]' : 'fill-slate-100 text-slate-200'}
            />
        ))}
    </div>
);

const AdminFeedback = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [aiRefreshing, setAiRefreshing] = useState(false);
    const [usingDemoData, setUsingDemoData] = useState(false);
    const [backendEvents, setBackendEvents] = useState([]);

    useEffect(() => {
        const getAuthHeaders = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;
            return token ? { Authorization: `Bearer ${token}` } : {};
        };

        const applyAnalysisData = (data) => {
            const events = Array.isArray(data.events) ? data.events : [];
            setBackendEvents(events);
            setFeedback(events.flatMap((event) => event.reviews || []));
            setUsingDemoData(false);
        };

        const fetchFeedback = async () => {
            try {
                const res = await fetch('/api/feedback/analysis?ai=false', {
                    headers: getAuthHeaders(),
                });

                if (!res.ok) throw new Error('Failed to fetch feedback analysis');

                const data = await res.json();
                applyAnalysisData(data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setBackendEvents([]);
                setFeedback([]);
                setUsingDemoData(false);
                toast.error('Failed to load feedback analytics');
            } finally {
                setLoading(false);
            }
        };

        const refreshAiSummary = async () => {
            setAiRefreshing(true);
            try {
                const res = await fetch('/api/feedback/analysis?refresh=true', {
                    headers: getAuthHeaders(),
                });

                if (!res.ok) throw new Error('Failed to refresh AI analysis');

                const data = await res.json();
                applyAnalysisData(data);
            } catch (error) {
                console.error('AI summary refresh failed:', error);
            } finally {
                setAiRefreshing(false);
            }
        };

        fetchFeedback();
        refreshAiSummary();
    }, []);

    const enrichedFeedback = useMemo(
        () => feedback.map((item) => ({ ...item, sentiment: getSentiment(item) })),
        [feedback],
    );

    const eventSummaries = useMemo(() => {
        if (backendEvents.length > 0) {
            return backendEvents.map((event, index) => ({
                ...event,
                icon: eventIcons[index % eventIcons.length],
                items: (event.reviews || []).map((review) => ({
                    ...review,
                    _id: review._id || review.id,
                    sentiment: review.sentiment || getSentiment(review),
                })),
            }));
        }

        const grouped = enrichedFeedback.reduce((acc, item) => {
            const title = item.title || 'Untitled Event';
            if (!acc[title]) acc[title] = [];
            acc[title].push(item);
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([title, items], index) => {
                const sorted = [...items].sort((a, b) => getDateValue(b.date || b.createdAt) - getDateValue(a.date || a.createdAt));
                const counts = {
                    positive: items.filter((item) => item.sentiment === 'positive').length,
                    neutral: items.filter((item) => item.sentiment === 'neutral').length,
                    negative: items.filter((item) => item.sentiment === 'negative').length,
                };
                const total = items.length;
                const Icon = eventIcons[index % eventIcons.length];

                return {
                    title,
                    date: sorted[0]?.date || 'Upcoming',
                    total,
                    icon: Icon,
                    percentages: {
                        positive: formatPercent(counts.positive, total),
                        neutral: formatPercent(counts.neutral, total),
                        negative: formatPercent(counts.negative, total),
                    },
                    items: sorted,
                };
            })
            .sort((a, b) => getDateValue(b.date) - getDateValue(a.date));
    }, [backendEvents, enrichedFeedback]);

    const visibleEvents = eventSummaries.filter((event) => {
        const haystack = `${event.title} ${event.date} ${event.items.map((item) => item.feedback).join(' ')}`.toLowerCase();
        const matchesSearch = haystack.includes(searchQuery.toLowerCase());
        const matchesEvent = eventFilter === 'all' || event.title === eventFilter;
        return matchesSearch && matchesEvent;
    });

    const selectedEventSummary = selectedEvent
        ? eventSummaries.find((event) => event.title === selectedEvent.title) || selectedEvent
        : null;
    const currentEvent = selectedEventSummary || visibleEvents[0] || eventSummaries[0];
    const currentReviews = currentEvent?.items || [];
    const filteredReviews = currentReviews.filter((item) => activeFilter === 'all' || item.sentiment === activeFilter);
    const detectedThemes = analyzeThemes(currentReviews);
    const sentimentThemeFallback = currentEvent ? [
        { label: 'Positive', percent: currentEvent.percentages.positive, sentiment: 'positive' },
        { label: 'Neutral', percent: currentEvent.percentages.neutral, sentiment: 'neutral' },
        { label: 'Negative', percent: currentEvent.percentages.negative, sentiment: 'negative' },
    ] : [];
    const displayThemes = detectedThemes.length > 0 ? detectedThemes : sentimentThemeFallback;
    const aiSummary = currentEvent ? (currentEvent.summary || createSummary(currentEvent.title, currentReviews, displayThemes)) : { right: [], wrong: [], future: [] };

    const openEvent = (event) => {
        setSelectedEvent(event);
        setActiveFilter('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const closeEvent = () => {
        setSelectedEvent(null);
        setActiveFilter('all');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#5CB85C] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-900">
            <div className="border-b border-slate-100 bg-white px-5 py-4">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search analytics, feedback, or events..."
                            className="h-11 w-full rounded-full border border-transparent bg-slate-100/80 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-200 focus:bg-white focus:shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
                {!selectedEvent ? (
                    <>
                        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#5CB85C]">Admin Feedback AI / Analysis</p>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">AI Feedback Insights</h1>
                                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                                    Real-time sentiment classification and thematic analysis across all event feedback platforms.
                                </p>
                                {usingDemoData && (
                                    <p className="mt-2 text-xs font-semibold text-amber-600">Sample analytics are shown until live feedback is available.</p>
                                )}
                            </div>

                            <label className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                Filter by Event:
                                <select
                                    value={eventFilter}
                                    onChange={(event) => setEventFilter(event.target.value)}
                                    className="h-10 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 outline-none focus:border-[#5CB85C]"
                                >
                                    <option value="all">All Events</option>
                                    {eventSummaries.map((event) => (
                                        <option key={event.title} value={event.title}>{event.title}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                            {visibleEvents.map((event) => {
                                const Icon = event.icon || BarChart3;

                                return (
                                    <article key={event.title} className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="mb-7 flex items-start justify-between gap-4">
                                            <div>
                                                <h2 className="text-lg font-extrabold text-slate-900">{event.title}</h2>
                                                <p className="mt-1 text-sm font-semibold text-slate-400">{event.date}</p>
                                            </div>
                                            <Icon className="h-5 w-5 text-[#5CB85C]" strokeWidth={1.8} />
                                        </div>

                                        <div className="space-y-4">
                                            <SentimentBar type="positive" percent={event.percentages.positive} />
                                            <SentimentBar type="neutral" percent={event.percentages.neutral} />
                                            <SentimentBar type="negative" percent={event.percentages.negative} />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => openEvent(event)}
                                            className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#66BF3D] text-sm font-extrabold text-white shadow-sm transition hover:bg-[#57AA32]"
                                        >
                                            View Reviews <ArrowRight size={15} />
                                        </button>
                                    </article>
                                );
                            })}
                        </div>

                        {visibleEvents.length === 0 && (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-white py-16 text-center">
                                <p className="text-sm font-semibold text-slate-500">
                                    {eventSummaries.length === 0 ? 'No user feedback has been submitted yet.' : 'No feedback analytics match your search.'}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={closeEvent}
                                className="flex items-center gap-2 text-xs font-extrabold text-slate-500 transition hover:text-[#5CB85C]"
                            >
                                <ArrowLeft size={15} /> Feedback / View Reviews
                            </button>
                            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm sm:flex">
                                <Sparkles size={14} className="text-[#5CB85C]" />
                                {aiRefreshing ? 'Refreshing AI summary...' : 'AI summary ready'}
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                            <SentimentStatCard type="positive" percent={currentEvent.percentages.positive} />
                            <SentimentStatCard type="neutral" percent={currentEvent.percentages.neutral} />
                            <SentimentStatCard type="negative" percent={currentEvent.percentages.negative} />
                        </div>

                        <div className="mb-7 flex flex-wrap gap-2 rounded-lg bg-slate-100 p-1 md:w-fit">
                            {['all', 'positive', 'negative', 'neutral'].map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`h-8 rounded-md px-5 text-xs font-bold capitalize transition ${
                                        activeFilter === filter ? 'bg-white text-[#5CB85C] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {filter === 'all' ? 'All Feedbacks' : filter}
                                </button>
                            ))}
                        </div>

                        <section className="space-y-4">
                            {filteredReviews.map((item) => {
                                const sentiment = sentimentConfig[item.sentiment];

                                return (
                                    <article key={item._id || `${item.email}-${item.date}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-500">
                                                {getInitials(item.email)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{item.email}</p>
                                                        <p className="mt-1 text-xs font-semibold text-slate-400">{item.date || currentEvent.date}</p>
                                                    </div>
                                                    <RatingStars rating={item.rating} />
                                                </div>
                                                <p className="max-w-4xl text-sm font-medium leading-6 text-slate-500">
                                                    "{item.feedback}"
                                                </p>
                                                <span
                                                    className={`mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-extrabold ${sentiment.bg} ${sentiment.text}`}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sentiment.color }} />
                                                    Sentiment: {sentiment.label}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}

                            {filteredReviews.length === 0 && (
                                <div className="rounded-lg border border-dashed border-slate-200 bg-white py-12 text-center">
                                    <p className="text-sm font-semibold text-slate-500">No reviews found for this sentiment.</p>
                                </div>
                            )}
                        </section>

                        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.3fr]">
                            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-base font-extrabold text-slate-900">Top Feedback Themes</h2>
                                    <Wifi size={17} className="text-[#5CB85C]" />
                                </div>
                                {currentReviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {displayThemes.map((theme) => {
                                            const config = sentimentConfig[theme.sentiment];

                                            return (
                                                <div key={theme.label}>
                                                    <div className="mb-1 flex justify-between gap-3 text-xs font-bold">
                                                        <span className="text-slate-700">{theme.label}</span>
                                                        <span style={{ color: config.color }}>
                                                            {theme.percent}% {config.label}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-slate-100">
                                                        <div className="h-full rounded-full" style={{ width: `${theme.percent}%`, backgroundColor: config.color }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium leading-6 text-slate-400">
                                        No recurring themes detected from this event's feedback yet.
                                    </p>
                                )}
                            </section>

                            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                <div className="bg-[#17162D] px-6 py-5 text-white">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={18} className="text-[#66BF3D]" />
                                        <h2 className="text-base font-extrabold">AI Generated Summary</h2>
                                    </div>
                                    <p className="mt-1 text-xs font-medium text-slate-300">
                                        Based on all submitted feedback. Updated automatically.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 divide-y divide-slate-100 p-6 md:grid-cols-3 md:divide-x md:divide-y-0">
                                    <SummaryColumn color="#5CB85C" title="What Went Right" items={aiSummary.right} />
                                    <SummaryColumn color="#D01F1F" title="What Went Wrong" items={aiSummary.wrong} />
                                    <SummaryColumn color="#D6A800" title="Future Improvements" items={aiSummary.future} />
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

const SummaryColumn = ({ color, title, items }) => (
    <div className="py-4 first:pt-0 last:pb-0 md:px-5 md:py-0 md:first:pl-0 md:last:pr-0">
        <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        </div>
        {items.length > 0 ? (
            <ul className="space-y-3">
                {items.map((item) => (
                    <li key={item} className="text-xs font-medium leading-5 text-slate-500">
                        {item}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-xs font-medium leading-5 text-slate-400">No matching feedback yet.</p>
        )}
    </div>
);

export default AdminFeedback;
