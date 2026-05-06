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

const demoFeedback = [
    {
        _id: 'demo-1',
        title: 'Tech Frontiers 2024',
        email: 'ayushabc@gmail.com',
        date: 'Oct 24, 2024',
        rating: 2,
        feedback: 'The session on sustainable materials was eye-opening, but the queue for the afternoon workshop was poorly managed. We waited for 45 minutes in the heat.',
    },
    {
        _id: 'demo-2',
        title: 'Tech Frontiers 2024',
        email: 'ayushab@gmail.com',
        date: 'Oct 24, 2024',
        rating: 5,
        feedback: 'Absolutely fantastic organization. The AI-driven networking app actually paired me with the exact people I needed to meet for my project. Brilliant.',
    },
    {
        _id: 'demo-3',
        title: 'Tech Frontiers 2024',
        email: 'ayshabo@gmail.com',
        date: 'Oct 24, 2024',
        rating: 4,
        feedback: 'The speakers were very high quality, but the venue wifi was inconsistent in Hall B. Hard to take notes and follow live demos.',
    },
    {
        _id: 'demo-4',
        title: 'Green Design Summit',
        email: 'mira@example.com',
        date: 'Nov 12, 2024',
        rating: 4,
        feedback: 'Great workshops and thoughtful speakers. Registration was clear, but the food counter needed more staff during lunch.',
    },
    {
        _id: 'demo-5',
        title: 'Green Design Summit',
        email: 'samir@example.com',
        date: 'Nov 12, 2024',
        rating: 3,
        feedback: 'The sustainability panel was useful. The venue layout was confusing and the afternoon session started late.',
    },
    {
        _id: 'demo-6',
        title: 'Global Logistics Expo',
        email: 'rina@example.com',
        date: 'Jan 18, 2025',
        rating: 4,
        feedback: 'Strong speaker lineup and smooth check-in. The event app reminders were helpful, although parking signs could be better.',
    },
    {
        _id: 'demo-7',
        title: 'Leadership in Disruption',
        email: 'nabin@example.com',
        date: 'Dec 05, 2024',
        rating: 5,
        feedback: 'Excellent keynote and very practical breakout sessions. Networking opportunities were well received by attendees.',
    },
];

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

const eventIcons = [TrendingUp, Leaf, MessageCircle, Trophy];

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

const getDateValue = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatPercent = (count, total) => {
    if (!total) return 0;
    return Math.round((count / total) * 100);
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

const getFallbackThemeRows = () => [
    { label: 'Workshop Quality', percent: 88, sentiment: 'positive' },
    { label: 'Registration Flow', percent: 62, sentiment: 'neutral' },
    { label: 'On-site Wi-Fi', percent: 45, sentiment: 'negative' },
];

const createSummary = (eventName, items, themes) => {
    const positive = items.filter((item) => item.sentiment === 'positive');
    const negative = items.filter((item) => item.sentiment === 'negative');
    const neutral = items.filter((item) => item.sentiment === 'neutral');

    const topPositiveTheme = themes.find((theme) => theme.sentiment === 'positive')?.label || 'speaker and session quality';
    const topConcernTheme = themes.find((theme) => theme.sentiment === 'negative')?.label || 'onsite operations';
    const topNeutralTheme = themes.find((theme) => theme.sentiment === 'neutral')?.label || 'registration flow';

    return {
        right: [
            `${topPositiveTheme} was consistently praised across attendee responses.`,
            positive.length ? `${positive.length} review${positive.length === 1 ? '' : 's'} mention strong value from the event experience.` : 'Positive notes highlight useful sessions and practical takeaways.',
            'Networking opportunities were well received by attendees.',
        ],
        wrong: [
            `${topConcernTheme} created friction for several attendees.`,
            negative.length ? `${negative.length} negative review${negative.length === 1 ? '' : 's'} need operational follow-up.` : 'A few comments point to small onsite coordination issues.',
            `${topNeutralTheme} should be watched because it appears in mixed feedback.`,
        ],
        future: [
            `Improve crowd-flow management for ${eventName}.`,
            'Upgrade venue Wi-Fi infrastructure before the next event.',
            'Simplify the registration and booking process for users.',
        ],
        meta: neutral.length ? 'Balanced sentiment with a few execution risks.' : 'Generated from available review patterns.',
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
                setFeedback(demoFeedback);
                setUsingDemoData(true);
                toast.error('Showing sample feedback analytics');
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
    const themeRows = currentEvent?.themes?.length ? currentEvent.themes : analyzeThemes(currentReviews);
    const displayThemes = themeRows.length ? themeRows : getFallbackThemeRows();
    const aiSummary = currentEvent ? (currentEvent.summary || createSummary(currentEvent.title, currentReviews, displayThemes)) : null;

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
                                <p className="text-sm font-semibold text-slate-500">No feedback analytics match your search.</p>
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
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item} className="text-xs font-medium leading-5 text-slate-500">
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

export default AdminFeedback;
