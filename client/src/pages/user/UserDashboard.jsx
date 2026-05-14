import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserPageHeader from "../../components/user/UserPageHeader";
import UserSearch from "../../components/user/UserSearch";
import UserFilterBar from "../../components/user/UserFilterBar";
import UserEmptyState from "../../components/user/UserEmptyState";
import EventCard from "../../components/ui/EventCard";
import { getDateKey, isPastEvent, isUpcomingEvent, parseEventDate } from "../../utils/eventDates";
import { BookOpen, Search } from "lucide-react";

export default function UserDashboard() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [events, setEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [otherPastEvents, setOtherPastEvents] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(true);

    // Get dynamic user data
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { name: "Guest" };
    const userName = user.name || "User";
    const token = user.token;
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

    const attachRegistrationState = useCallback((event) => ({
        ...event,
        id: event._id,
        isRegistered:
            !!currentUserId &&
            Array.isArray(event.registeredParticipants) &&
            event.registeredParticipants.some(isParticipantMatch),
    }), [currentUserId, isParticipantMatch]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all events for popular section
                const eventsRes = await fetch('/api/events');
                const eventsData = await eventsRes.json();
                const mappedEvents = eventsData.map(attachRegistrationState);
                const upcomingEvents = mappedEvents.filter(isUpcomingEvent);
                setEvents(upcomingEvents);
                setDisplayedEvents(upcomingEvents.slice(0, 3));
                setOtherPastEvents(mappedEvents.filter((event) => isPastEvent(event) && !event.isRegistered));

                // Fetch recommendations from backend
                if (user._id && token) {
                    const recRes = await fetch(`/api/events/recommendations?userId=${user._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const recData = await recRes.json();
                    setRecommendedEvents(recData.map(attachRegistrationState).filter(isUpcomingEvent));
                } else {
                    // Fallback to local slice if not logged in
                    setRecommendedEvents(upcomingEvents.slice(3, 6));
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [user?._id, token, attachRegistrationState]);

    const hasActiveFilters = useMemo(() => 
        query.trim() !== "" || date !== "" || category !== "All Categories",
    [query, date, category]);

    const filterEvents = useCallback(() => {
        let filtered = [...events];
        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(e => 
                (e.title || "").toLowerCase().includes(q) || 
                (e.location || "").toLowerCase().includes(q) || 
                (e.category || "").toLowerCase().includes(q)
            );
        }
        if (category !== "All Categories") {
            filtered = filtered.filter(e => (e.category || "").toLowerCase() === category.toLowerCase());
        }
        if (date) {
            // Normalize selected date to YYYY-MM-DD
            const selected = new Date(date);
                const selectedStr = getDateKey(selected);
            
            filtered = filtered.filter(e => {
                const d = parseEventDate(e.date);
                if (!d) return false;
                const dStr = getDateKey(d);
                return dStr === selectedStr;
            });
        }
        setDisplayedEvents(hasActiveFilters ? filtered : filtered.slice(0, 3));
    }, [query, category, date, hasActiveFilters, events]);

    // Apply filters automatically when search/filter state changes
    useEffect(() => {
        filterEvents();
    }, [query, date, category, filterEvents]);

    const filteredOtherPastEvents = useMemo(() => {
        let filtered = [...otherPastEvents];

        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(e =>
                (e.title || "").toLowerCase().includes(q) ||
                (e.location || "").toLowerCase().includes(q) ||
                (e.category || "").toLowerCase().includes(q)
            );
        }

        if (category !== "All Categories") {
            filtered = filtered.filter(e => (e.category || "").toLowerCase() === category.toLowerCase());
        }

        if (date) {
            const selected = new Date(date);
            const selectedStr = getDateKey(selected);

            filtered = filtered.filter(e => {
                const d = parseEventDate(e.date);
                if (!d) return false;
                return getDateKey(d) === selectedStr;
            });
        }

        return filtered;
    }, [otherPastEvents, query, category, date]);

    const handleReset = () => {
        setQuery("");
        setDate("");
        setCategory("All Categories");
    };

    const ViewAllLink = () => (
        <Link to="/all-events" className="text-[#5CB85C] text-sm font-bold flex items-center gap-1 hover:underline group">
            View all <span className="group-hover:translate-x-1 transition-transform">-&gt;</span>
        </Link>
    );

    const renderPastActions = (event, label = "Event Closed") => (
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
                placeholder="Search events by title, location or category..." 
            />

            {/* Main Welcome Section */}
            <UserPageHeader 
                title="Welcome back,"
                highlightWord={userName}
                subtitle={loading ? "Finding your events..." : `You have ${events.length} events coming up this week.`}
            />

            <UserFilterBar 
                date={date} setDate={setDate}
                category={category} setCategory={setCategory}
                categories={["UI/UX DESIGN", "TECHNOLOGY", "ART", "BUSINESS"]}
                onApply={filterEvents}
                onReset={handleReset}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Popular Events Section */}
            <div className="space-y-6">
                <UserPageHeader 
                    title={hasActiveFilters ? "Search Results" : "Popular Events"} 
                    rightElement={<ViewAllLink />}
                />
                
                {loading ? (
                    <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading events...</div>
                ) : displayedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedEvents.map(e => <EventCard key={e.id} event={e} />)}
                    </div>
                ) : (
                    <UserEmptyState 
                        icon={<Search className="h-16 w-16" strokeWidth={1.5} />}
                        title="No events matches your criteria" 
                        description="Try adjusting your search or filters to find what you're looking for." 
                    />
                )}
            </div>

            {/* Recommendation Section - Only show when not searching */}
            {!hasActiveFilters && !loading && (
                <div className="space-y-6 pt-10 border-t border-slate-50 mt-10">
                    <UserPageHeader 
                        title="Recommend for You" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedEvents.length > 0 ? (
                            recommendedEvents.map(e => (
                                <EventCard 
                                    key={`rec-${e.id}`} 
                                    event={e} 
                                    showButtons={true} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold">More recommendations coming soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <section className="space-y-5 border-t border-slate-100 pt-10">
                <UserPageHeader
                    title="Previous Events"
                    subtitle={loading ? "Loading event history..." : `${filteredOtherPastEvents.length} past event${filteredOtherPastEvents.length === 1 ? "" : "s"}`}
                />

                {loading ? (
                    <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Loading past events...</div>
                ) : filteredOtherPastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOtherPastEvents.map((event) => (
                            <EventCard
                                key={`past-${event.id}`}
                                event={event}
                                showButtons={true}
                                customActions={renderPastActions(event, "Event Closed")}
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
