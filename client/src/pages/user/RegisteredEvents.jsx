import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserPageHeader from "../../components/user/UserPageHeader";
import UserSearch from "../../components/user/UserSearch";
import UserFilterBar from "../../components/user/UserFilterBar";
import UserEmptyState from "../../components/user/UserEmptyState";
import EventCard from "../../components/ui/EventCard";
import { getDateKey, isUpcomingEvent, parseEventDate } from "../../utils/eventDates";
import { Search } from "lucide-react";

export default function RegisteredEvents() {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
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

    const attachRegistrationState = useCallback((event) => {
        const isRegistered =
            !!currentUserId &&
            Array.isArray(event.registeredParticipants) &&
            event.registeredParticipants.some(isParticipantMatch);

        return {
            ...event,
            id: event._id || event.id,
            isRegistered,
        };
    }, [currentUserId, isParticipantMatch]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;

            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                const mappedEvents = Array.isArray(data) ? data.map(attachRegistrationState) : [];

                setAllEvents(mappedEvents);
                setMyEvents(mappedEvents.filter((event) => event.isRegistered));
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user, attachRegistrationState]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const categories = useMemo(() => (
        [...new Set(allEvents.map((event) => event.category).filter(Boolean))]
    ), [allEvents]);

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

    const upcomingMyEvents = useMemo(
        () => myEvents.filter(isUpcomingEvent).filter(matchesFilters),
        [myEvents, matchesFilters]
    );

    const allUpcomingEvents = useMemo(
        () => allEvents.filter(isUpcomingEvent).filter(matchesFilters),
        [allEvents, matchesFilters]
    );

    const baseMyEventCount = useMemo(
        () => myEvents.filter(isUpcomingEvent).length,
        [myEvents]
    );

    const baseAllEventCount = useMemo(
        () => allEvents.filter(isUpcomingEvent).length,
        [allEvents]
    );

    const hasActiveFilters = query.trim() !== "" || date !== "" || category !== "All Categories";

    const renderMyEventActions = (event) => (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => navigate(`/event-details/${event.id}`)}
                className="w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] bg-[#5CB85C] text-white"
            >
                Registered
            </button>
            <button
                onClick={() => navigate(`/event-details/${event.id}`)}
                className="w-full bg-[#F3F6F9] hover:bg-[#E8EDF2] text-[#5E718D] py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            >
                View Details
            </button>
        </div>
    );

    return (
        <UserPageContainer
            isMobile={isMobile}
            header={
                <UserSearch
                    value={query}
                    onChange={setQuery}
                    placeholder="Search events..."
                />
            }
        >

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
                        title="My Events"
                        subtitle={loading ? "Checking your registrations..." : `${upcomingMyEvents.length} of ${baseMyEventCount} upcoming registered event${baseMyEventCount === 1 ? "" : "s"}`}
                    />

                    {loading ? (
                        <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading your events...</div>
                    ) : upcomingMyEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingMyEvents.map((event) => (
                                <EventCard
                                    key={`my-event-${event.id}`}
                                    event={event}
                                    showButtons={true}
                                    customActions={renderMyEventActions(event)}
                                />
                            ))}
                        </div>
                    ) : (
                        <UserEmptyState
                            icon={<Search className="h-16 w-16" strokeWidth={1.5} />}
                            title={hasActiveFilters ? "No matching events" : "No upcoming registered events"}
                            description={hasActiveFilters ? "Try adjusting your search or filters." : "Events you register for will appear here."}
                        />
                    )}
                </section>

                <section className="space-y-5 border-t border-slate-100 pt-10">
                    <UserPageHeader
                        title="All Events"
                        subtitle={loading ? "Loading upcoming events..." : `${allUpcomingEvents.length} of ${baseAllEventCount} upcoming event${baseAllEventCount === 1 ? "" : "s"}`}
                    />

                    {loading ? (
                        <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading all events...</div>
                    ) : allUpcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allUpcomingEvents.map((event) => (
                                <EventCard
                                    key={`all-event-${event.id}`}
                                    event={event}
                                    showButtons={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <UserEmptyState
                            icon={<Search className="h-16 w-16" strokeWidth={1.5} />}
                            title={hasActiveFilters ? "No matching upcoming events" : "No upcoming events"}
                            description={hasActiveFilters ? "Try adjusting your search or filters." : "Upcoming events will appear here."}
                        />
                    )}
                </section>
            </div>
        </UserPageContainer>
    );
}
