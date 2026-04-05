import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Search, Calendar, RefreshCcw } from "lucide-react";
import EventCard from "../../components/ui/EventCard";
import Button from "../../components/ui/Button";

const EVENTS = [
    { id: 1, title: "UI/UX Design Summit", location: "Creative Hub, NYC", date: "Apr 01, 2026", category: "UI/UX DES", categoryColor: "#6c8ebf" },
    { id: 2, title: "DevCorps 2024", location: "Main Auditorium", date: "Apr 28, 2026", category: "TECHNOLOG", categoryColor: "#c97b7b" },
    { id: 3, title: "Modern Art Gala", location: "Metropolitan Gallery", date: "Apr 05, 2026", category: "ART", categoryColor: "#8b8b6e" },
    { id: 4, title: "React Summit 2024", location: "Tech Center, SF", date: "Apr 15, 2026", category: "TECHNOLOG", categoryColor: "#c97b7b" },
    { id: 5, title: "Brand Strategy Workshop", location: "Downtown Hub", date: "Nov 30, 2026", category: "BUSINESS", categoryColor: "#7b9e87" },
    { id: 6, title: "Photography Expo", location: "Art District", date: "Dec 10, 2026", category: "ART", categoryColor: "#8b8b6e" },
];

export default function EventsPage() {
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [displayedEvents, setDisplayedEvents] = useState(EVENTS);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const upcomingCount = EVENTS.filter(e => {
        if (!e.date) return false;
        const eDate = new Date(e.date);
        return eDate >= new Date();
    }).length;

    const hasActiveFilters = query.trim() !== "" || category !== "All Categories" || date !== "";

    const resetFilters = () => {
        setQuery("");
        setDate("");
        setCategory("All Categories");
    };

    const filterEvents = useCallback(() => {
        let filtered = [...EVENTS];
        const isSearching = query.trim() !== "" || category !== "All Categories" || date.trim() !== "";

        // Apply Filters
        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.location.toLowerCase().includes(q) ||
                e.category.toLowerCase().includes(q)
            );
        }

        if (category !== "All Categories") {
            filtered = filtered.filter(e => e.category.toLowerCase() === category.toLowerCase());
        }

        if (date.trim()) {
            const selectedDate = new Date(date).toDateString();
            filtered = filtered.filter(e => {
                if (!e.date) return false;
                const eventDate = new Date(e.date).toDateString();
                return eventDate === selectedDate;
            });
        }

        setDisplayedEvents(isSearching ? filtered : filtered.slice(0, 3));
    }, [query, category, date]);

    useEffect(() => {
        filterEvents();
    }, [filterEvents]);

    const inputRef = useRef(null);

    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans pb-12">
            <div className="max-w-[1100px] mx-auto px-7 py-6">

                {/* Search Bar */}
                <div className="relative mb-7">
                    <div className="flex items-center bg-white rounded-[50px] px-5 py-2.5 gap-2.5 shadow-sm">
                        <Search size={18} className="text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search events..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-none outline-none flex-1 text-sm text-slate-800 bg-transparent"
                        />
                    </div>
                </div>

                {/* Welcome */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                        Welcome back, <span className="text-[#4caf50]">Anjul</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">You have {upcomingCount} events coming up!</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-5 mb-7 flex flex-col md:flex-row md:items-end flex-wrap gap-5 shadow-sm border border-slate-100">
                    <div className="flex-1 md:max-w-[200px]">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Event Date</label>
                        <div className="flex items-center gap-2 border-2 border-slate-50 rounded-xl px-3 py-2.5 bg-slate-50/50">
                            <Calendar size={14} className="text-slate-400" />
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                className="border-none outline-none text-xs text-slate-700 bg-transparent w-full cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex-1 md:max-w-[200px]">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className="w-full border-2 border-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-700 bg-slate-50/50 outline-none cursor-pointer appearance-none">
                            <option>All Categories</option>
                            <option>UI/UX Design</option>
                            <option>Technology</option>
                            <option>Art</option>
                            <option>Business</option>
                        </select>
                    </div>
                    <div className="ml-auto w-full md:w-auto">
                        <Button 
                            variant={hasActiveFilters ? 'secondary' : 'primary'}
                            onClick={hasActiveFilters ? resetFilters : filterEvents}
                            className="w-full md:w-auto"
                            icon={hasActiveFilters ? RefreshCcw : undefined}
                        >
                            {hasActiveFilters ? "Clear Filters" : "Apply Filters"}
                        </Button>
                    </div>
                </div>

                {/* Popular Events */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-extrabold text-slate-900">
                            {query || category !== "All Categories" || date ? "Search Results" : "Popular Events"}
                        </h2>
                        <a href="#" className="text-[#4caf50] text-sm font-bold flex items-center gap-1 hover:underline">
                            View all <span>→</span>
                        </a>
                    </div>
                    
                    {displayedEvents.length === 0 ? (
                        <div className="p-10 text-center bg-white rounded-xl">
                            <div className="text-3xl mb-2">🔍</div>
                            <div className="font-bold text-slate-800">No events match your criteria</div>
                            <div className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {displayedEvents.map(e => <EventCard key={e.id} event={e} />)}
                        </div>
                    )}
                </div>

                {/* Recommended */}
                <div>
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4">Recommended for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {EVENTS.slice(0, 3).map(e => <EventCard key={`rec-${e.id}`} event={{ ...e, date: undefined }} showButtons={false} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}