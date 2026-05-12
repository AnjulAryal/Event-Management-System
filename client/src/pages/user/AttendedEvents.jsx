import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserPageHeader from "../../components/user/UserPageHeader";
import UserSearch from "../../components/user/UserSearch";
import UserFilterBar from "../../components/user/UserFilterBar";
import UserEmptyState from "../../components/user/UserEmptyState";
import EventCard from "../../components/ui/EventCard";
import { BookOpen, CalendarCheck, Search } from "lucide-react";

const parseEventDate = (value) => {
    if (!value) return null;

    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) return direct;

    const cleaned = String(value).split("T")[0].trim();
    const fallback = new Date(cleaned);
    if (!Number.isNaN(fallback.getTime())) return fallback;

    return null;
};

const getDateKey = (dateObj) => (
    `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
);

const toLocalMidnight = (dateObj) => new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

export default function AttendedEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [allPastEvents, setAllPastEvents] = useState([]);
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(true);

    const user = useMemo(() => {
        const userString = localStorage.getItem("user");
        return userString ? JSON.parse(userString) : null;
    }, []);
    const currentUserId = user?._id ? String(user._id) : "";

    const isParticipantMatch = useCallback((participant) => {
        if (!participant || !currentUserId) return false;
        if (typeof participant === "string") return participant === currentUserId;
        if (typeof participant === "object") {
            if (participant._id) return String(participant._id) === currentUserId;
            if (participant.id) return String(participant.id) === currentUserId;
        }
        return String(participant) === currentUserId;
    }, [currentUserId]);

    const isAttendedEvent = useCallback((event) => {
        const parsed = parseEventDate(event?.date);
        if (!parsed) return false;
        return toLocalMidnight(parsed) < toLocalMidnight(new Date());
    }, []);

    useEffect(() => {
        const fetchAttended = async () => {
            if (!user) return;

            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                const attended = data
                    .filter(
                        (event) =>
                            Array.isArray(event.registeredParticipants) &&
                            event.registeredParticipants.some(isParticipantMatch) &&
                            isAttendedEvent(event)
                    )
                    .map((event) => ({ ...event, id: event._id, isRegistered: true }));

                setEvents(attended);
                setAllPastEvents(
                    data
                        .filter((event) => isAttendedEvent(event))
                        .map((event) => ({ ...event, id: event._id }))
                );
            } catch (error) {
                console.error("Error fetching attended events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttended();
    }, [user, isParticipantMatch, isAttendedEvent]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const categories = useMemo(() => (
        [...new Set(events.map((event) => event.category).filter(Boolean))]
    ), [events]);

    const matchesFilters = useCallback((event) => {
        if (query.trim()) {
            const q = query.toLowerCase();
            const haystack = `${event.title || ""} ${event.location || ""} ${event.category || ""}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }

        if (category !== "All Categories" && String(event.category || "").toLowerCase() !== category.toLowerCase()) {
            return false;
        }

        if (date) {
            const selectedDate = new Date(date);
            if (Number.isNaN(selectedDate.getTime())) return false;

            const parsedEventDate = parseEventDate(event.date);
            if (!parsedEventDate) return false;

            if (getDateKey(parsedEventDate) !== getDateKey(selectedDate)) return false;
        }

        return true;
    }, [query, category, date]);

    const filteredEvents = useMemo(() => events.filter(matchesFilters), [events, matchesFilters]);
    const otherPastEvents = useMemo(() => {
        const attendedIds = new Set(events.map((event) => event.id));
        return allPastEvents.filter((event) => !attendedIds.has(event.id)).filter(matchesFilters);
    }, [allPastEvents, events, matchesFilters]);
    const hasActiveFilters = query.trim() !== "" || date !== "" || category !== "All Categories";

    const renderActions = (event, label = "Attended Event") => (
        <div className="space-y-3">
            <div className="w-full py-3 rounded-xl text-sm font-bold text-center bg-[#7A96C6] text-white border border-[#6E88B6] shadow-[0_10px_24px_rgba(122,150,198,0.28)]">
                {label}
            </div>
            <button
                onClick={() => navigate(`/event-details/${event.id}`, { state: { from: "attended-events" } })}
                className="w-full bg-[#F3F6F9] hover:bg-[#E8EDF2] text-[#5E718D] py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            >
                View Details
            </button>
        </div>
    );

    return (
        <UserPageContainer isMobile={isMobile}>
            <UserSearch
                value={query}
                onChange={setQuery}
                placeholder="Search events..."
            />

            <UserFilterBar
                date={date}
                setDate={setDate}
                category={category}
                setCategory={setCategory}
                categories={categories}
                onApply={() => {}}
                onReset={() => {
                    setQuery("");
                    setDate("");
                    setCategory("All Categories");
                }}
                hasActiveFilters={hasActiveFilters}
            />

            <section className="space-y-5">
                <UserPageHeader
                    title="Attended Events"
                    subtitle={loading ? "Loading your past events..." : `${filteredEvents.length} attended event${filteredEvents.length === 1 ? "" : "s"}`}
                />

                {loading ? (
                    <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading attended events...</div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={`attended-${event.id}`}
                                    event={event}
                                    showButtons={true}
                                    customActions={renderActions(event, "Attended Event")}
                                />
                            ))}
                        </div>
                ) : (
                    <UserEmptyState
                        icon={hasActiveFilters ? <Search className="h-16 w-16" strokeWidth={1.5} /> : <CalendarCheck className="h-16 w-16" strokeWidth={1.5} />}
                        title={hasActiveFilters ? "No matching attended events" : "No attended events yet"}
                        description={hasActiveFilters ? "Try adjusting your search or filters." : "Past registered events will appear here automatically."}
                    />
                )}
            </section>

            <section className="space-y-5 border-t border-slate-100 pt-10">
                <UserPageHeader
                    title="Other Past Events"
                    subtitle={loading ? "Loading event history..." : `${otherPastEvents.length} past event${otherPastEvents.length === 1 ? "" : "s"}`}
                />

                {loading ? (
                    <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading past events...</div>
                ) : otherPastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherPastEvents.map((event) => (
                            <EventCard
                                key={`past-${event.id}`}
                                event={event}
                                showButtons={true}
                                customActions={renderActions(event, "Event Closed")}
                            />
                        ))}
                    </div>
                ) : (
                    <UserEmptyState
                        icon={hasActiveFilters ? <Search className="h-16 w-16" strokeWidth={1.5} /> : <BookOpen className="h-16 w-16" strokeWidth={1.5} />}
                        title={hasActiveFilters ? "No matching past events" : "No other past events found"}
                        description={hasActiveFilters ? "Try adjusting your search or filters." : "Past event history will appear here."}
                    />
                )}
            </section>
        </UserPageContainer>
    );
}
