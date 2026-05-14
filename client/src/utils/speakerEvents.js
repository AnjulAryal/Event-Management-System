import { parseEventDate, toLocalMidnight } from './eventDates';

export { parseEventDate };

export const getSpeakerId = (speaker) => String(speaker?._id || speaker?.id || speaker || '');

export const getEventSpeakerIds = (event) => {
    if (Array.isArray(event?.speakers)) {
        return event.speakers.map(getSpeakerId).filter(Boolean);
    }

    return [];
};

export const getEventsForSpeaker = (events, speakerId) => {
    const normalizedSpeakerId = String(speakerId);
    return events.filter((event) => getEventSpeakerIds(event).includes(normalizedSpeakerId));
};

export const getNextUpcomingEventForSpeaker = (events, speakerId) => {
    const today = toLocalMidnight(new Date());

    return getEventsForSpeaker(events, speakerId)
        .map((event) => ({ event, parsedDate: parseEventDate(event.date) }))
        .filter(({ parsedDate }) => !parsedDate || toLocalMidnight(parsedDate) >= today)
        .sort((a, b) => {
            if (!a.parsedDate && !b.parsedDate) return 0;
            if (!a.parsedDate) return 1;
            if (!b.parsedDate) return -1;
            return a.parsedDate - b.parsedDate;
        })[0]?.event || null;
};
