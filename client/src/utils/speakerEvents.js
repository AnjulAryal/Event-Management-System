export const getSpeakerId = (speaker) => String(speaker?._id || speaker?.id || speaker || '');

export const getEventSpeakerIds = (event) => {
    if (Array.isArray(event?.speakers)) {
        return event.speakers.map(getSpeakerId).filter(Boolean);
    }

    return [];
};

export const parseEventDate = (dateValue) => {
    if (!dateValue) return null;

    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) return parsed;

    const cleaned = String(dateValue).split('\u2014')[0].split('-')[0].trim();
    const fallback = new Date(cleaned);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
};

export const getEventsForSpeaker = (events, speakerId) => {
    const normalizedSpeakerId = String(speakerId);
    return events.filter((event) => getEventSpeakerIds(event).includes(normalizedSpeakerId));
};

export const getNextUpcomingEventForSpeaker = (events, speakerId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return getEventsForSpeaker(events, speakerId)
        .map((event) => ({ event, parsedDate: parseEventDate(event.date) }))
        .filter(({ parsedDate }) => !parsedDate || parsedDate >= today)
        .sort((a, b) => {
            if (!a.parsedDate && !b.parsedDate) return 0;
            if (!a.parsedDate) return 1;
            if (!b.parsedDate) return -1;
            return a.parsedDate - b.parsedDate;
        })[0]?.event || null;
};
