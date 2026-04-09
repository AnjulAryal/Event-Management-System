import { useState, useEffect, useCallback, useMemo } from "react";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserPageHeader from "../../components/user/UserPageHeader";
import UserSearch from "../../components/user/UserSearch";
import UserFilterBar from "../../components/user/UserFilterBar";
import UserEmptyState from "../../components/user/UserEmptyState";
import EventCard from "../../components/ui/EventCard";

export default function UserDashboard() {
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [events, setEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(true);

    // Get dynamic user data
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { name: "Guest" };
    const userName = user.name || "User";

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                const data = await res.json();
                // Map _id to id for component compatibility
                const mappedData = data.map(e => ({ ...e, id: e._id }));
                setEvents(mappedData);
                setDisplayedEvents(mappedData.slice(0, 3));
            } catch (error) {
                console.error("Error fetching events:", error);
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
            const selectedDate = new Date(date).toDateString();
            filtered = filtered.filter(e => new Date(e.date).toDateString() === selectedDate);
        }
        setDisplayedEvents(hasActiveFilters ? filtered : filtered.slice(0, 3));
    }, [query, category, date, hasActiveFilters, events]);

    const handleReset = () => {
        setQuery("");
        setDate("");
        setCategory("All Categories");
    };

    const ViewAllLink = () => (
        <a href="#" className="text-[#5CB85C] text-sm font-bold flex items-center gap-1 hover:underline group">
            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
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
                        icon="🔍" 
                        title="No events matches your criteria" 
                        description="Try adjusting your search or filters to find what you're looking for." 
                    />
                )}
            </div>

            {/* Recommendation Section - Only show when not searching */}
            {!hasActiveFilters && !loading && events.length > 3 && (
                <div className="space-y-6 pt-4">
                    <UserPageHeader 
                        title="Recommend for You" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.slice(3, 6).map(e => (
                            <EventCard 
                                key={`rec-${e.id}`} 
                                event={e} 
                                showButtons={true} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </UserPageContainer>
    );
}