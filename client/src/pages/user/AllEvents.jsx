import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserSearch from "../../components/user/UserSearch";
import EventCard from "../../components/ui/EventCard";
import UserEmptyState from "../../components/user/UserEmptyState";
import { ArrowLeft } from "lucide-react";

export default function AllEvents() {
    const [query, setQuery] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                const data = await res.json();
                setEvents(data.map(e => ({ ...e, id: e._id })));
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const filteredEvents = useMemo(() => {
        if (!query.trim()) return events;
        const q = query.toLowerCase();
        return events.filter(e => 
            (e.title || "").toLowerCase().includes(q) || 
            (e.location || "").toLowerCase().includes(q) || 
            (e.category || "").toLowerCase().includes(q)
        );
    }, [query, events]);

    return (
        <UserPageContainer isMobile={isMobile}>
            <div className="space-y-8">
                {/* Search Bar - At the very top */}
                <div className="sticky top-0 z-20 pt-2 pb-4 bg-[#eef0ec]/90 backdrop-blur-xl -mx-4 px-4">
                    <UserSearch 
                        value={query} 
                        onChange={setQuery} 
                        placeholder="Search all events by title, location or category..." 
                    />
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                    <div className="space-y-2">
                        <Link 
                            to="/dashboard" 
                            className="inline-flex items-center text-sm font-bold text-[#5CB85C] hover:gap-2 transition-all gap-1 mb-2"
                        >
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Explore <span className="text-[#5CB85C]">All Events</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl">
                            Discover amazing experiences, workshops, and gatherings tailored for your interests.
                        </p>
                    </div>
                </div>

                {/* Events Listing */}
                <div className="space-y-8 pb-20">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                            {query ? `Search Results • ${filteredEvents.length} found` : `Event Catalog • ${events.length} listings`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-[32px] h-[400px] animate-pulse shadow-sm border border-slate-100" />
                            ))}
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredEvents.map(e => (
                                <EventCard key={e.id} event={e} />
                            ))}
                        </div>
                    ) : (
                        <UserEmptyState 
                            icon="🔍" 
                            title="No events found" 
                            description="We couldn't find any events matching your current search. Try different keywords!" 
                        />
                    )}
                </div>
            </div>
        </UserPageContainer>
    );
}
