import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserPageHeader from "../../components/user/UserPageHeader";
import UserSearch from "../../components/user/UserSearch";
import UserFilterBar from "../../components/user/UserFilterBar";
import UserEmptyState from "../../components/user/UserEmptyState";
import EventCard from "../../components/ui/EventCard";

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

export default function RegisteredEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
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

    const isAttendedEvent = (event) => {
        const parsed = parseEventDate(event?.date);
        if (!parsed) return false;
        return toLocalMidnight(parsed) < toLocalMidnight(new Date());
    };

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;

            try {
                const res = await fetch("/api/events");
                const data = await res.json();

                const myEvents = data
                    .filter(
                        (event) =>
                            Array.isArray(event.registeredParticipants) &&
                            event.registeredParticipants.some(isParticipantMatch)
                    )
                    .map((event) => ({ ...event, id: event._id, isRegistered: true }));

                setEvents(myEvents);

                const recRes = await fetch(`/api/events/recommendations?userId=${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const recData = await recRes.json();
                setRecommendedEvents((recData || []).map((event) => ({ ...event, id: event._id })));
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user, isParticipantMatch]);

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
    const upcomingEvents = useMemo(() => filteredEvents.filter((event) => !isAttendedEvent(event)), [filteredEvents]);
    const attendedEvents = useMemo(() => filteredEvents.filter((event) => isAttendedEvent(event)), [filteredEvents]);
    const hasActiveFilters = query.trim() !== "" || date !== "" || category !== "All Categories";

    const baseUpcomingCount = useMemo(() => events.filter((event) => !isAttendedEvent(event)).length, [events]);
    const baseAttendedCount = useMemo(() => events.filter((event) => isAttendedEvent(event)).length, [events]);

    const renderActions = (event, attended = false) => (
        <div className="space-y-3">
            {attended ? (
                <div className="w-full py-3 rounded-xl text-sm font-bold text-center bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]">
                    Attended Event
                </div>
            ) : (
                <button
                    className="w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] bg-[#5CB85C] text-white"
                >
                    Registered
                </button>
            )}
            <button
                onClick={() => navigate(`/event-details/${event.id}`)}
                className="w-full bg-[#F3F6F9] hover:bg-[#E8EDF2] text-[#5E718D] py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            >
                View Details
            </button>
        </div>
    );

    const ViewAllLink = () => (
        <Link to="/all-events" className="text-[#5CB85C] text-sm font-bold flex items-center gap-1 hover:underline group">
            Explore more <span className="group-hover:translate-x-1 transition-transform">{'->'}</span>
        </Link>
    );

    return (
        <UserPageContainer isMobile={isMobile}>
            <UserSearch
                value={query}
                onChange={setQuery}
                placeholder="Search your registered and attended events..."
            />

            <UserPageHeader
                title="My Events"
                subtitle={loading ? "Fetching your bookings..." : `${baseUpcomingCount} upcoming and ${baseAttendedCount} attended events`}
                rightElement={<ViewAllLink />}
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

            <div className="space-y-12">
                <section className="space-y-5">
                    <UserPageHeader
                        title="Upcoming Events"
                        subtitle={loading ? "Checking your registrations..." : `${upcomingEvents.length} upcoming event${upcomingEvents.length === 1 ? "" : "s"}`}
                    />

                    {loading ? (
                        <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading upcoming events...</div>
                    ) : upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    showButtons={true}
                                    customActions={renderActions(event, false)}
                                />
                            ))}
                        </div>
                    ) : (
                        <UserEmptyState
                            icon={hasActiveFilters ? "🔎" : "📅"}
                            title={hasActiveFilters ? "No matching upcoming events" : "No upcoming events"}
                            description={hasActiveFilters ? "Try adjusting your search or filters." : "Your future registrations will show up here."}
                        />
                    )}
                </section>

                {!hasActiveFilters && !loading && recommendedEvents.length > 0 && (
                    <section className="space-y-6 pt-10 border-t border-slate-50">
                        <UserPageHeader title="Recommend for You" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedEvents.map((event) => (
                                <EventCard
                                    key={`recommended-${event.id}`}
                                    event={event}
                                    showButtons={true}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section className="space-y-5 border-t border-slate-100 pt-10">
                    <UserPageHeader
                        title="Attended Events"
                        subtitle={loading ? "Checking past events..." : `${attendedEvents.length} attended event${attendedEvents.length === 1 ? "" : "s"}`}
                    />

                    {loading ? (
                        <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading attended events...</div>
                    ) : attendedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {attendedEvents.map((event) => (
                                <EventCard
                                    key={`attended-${event.id}`}
                                    event={event}
                                    showButtons={true}
                                    customActions={renderActions(event, true)}
                                />
                            ))}
                        </div>
                    ) : (
                        <UserEmptyState
                            icon={hasActiveFilters ? "🔎" : "🎉"}
                            title={hasActiveFilters ? "No matching attended events" : "No attended events yet"}
                            description={hasActiveFilters ? "Try adjusting your search or filters." : "Once event dates pass, they will appear here automatically."}
                        />
                    )}
                </section>
            </div>
        </UserPageContainer>
    );
}
