import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
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
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(true);

    // Get dynamic user data
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { name: "Guest" };
    const userName = user.name || "User";
    const token = user.token;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all events for popular section
                const eventsRes = await fetch('/api/events');
                const eventsData = await eventsRes.json();
                const mappedEvents = eventsData.map(e => ({ ...e, id: e._id }));
                setEvents(mappedEvents);
                setDisplayedEvents(mappedEvents.slice(0, 3));

                // Fetch recommendations from backend
                if (user._id && token) {
                    const recRes = await fetch(`/api/events/recommendations?userId=${user._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const recData = await recRes.json();
                    setRecommendedEvents(recData.map(e => ({ ...e, id: e._id })));
                } else {
                    // Fallback to local slice if not logged in
                    setRecommendedEvents(mappedEvents.slice(3, 6));
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
    }, [user?._id, token]);

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
            const selectedStr = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
            
            filtered = filtered.filter(e => {
                if (!e.date) return false;
                const d = new Date(e.date);
                if (isNaN(d.getTime())) return false;
                const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return dStr === selectedStr;
            });
        }
        setDisplayedEvents(hasActiveFilters ? filtered : filtered.slice(0, 3));
    }, [query, category, date, hasActiveFilters, events]);

    // Apply filters automatically when search/filter state changes
    useEffect(() => {
        filterEvents();
    }, [query, date, category, filterEvents]);

    const handleReset = () => {
        setQuery("");
        setDate("");
        setCategory("All Categories");
    };

    const ViewAllLink = () => (
        <Link to="/all-events" className="text-[#5CB85C] text-sm font-bold flex items-center gap-1 hover:underline group">
            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
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
        </UserPageContainer>
    );
}