import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, ChevronDown } from "lucide-react";
import EventCard from "../../components/ui/EventCard";
import Button from "../../components/ui/Button";

// Simulated registered events
const REGISTERED_EVENTS = [
    { 
        id: 1, 
        title: "UI/UX Design Summit", 
        location: "Creative Hub, NYC", 
        date: "Dec 01, 2024", 
        category: "UI/UX DESIGN", 
        categoryColor: "#3b99fc",
        shortName: "UX" 
    },
    { 
        id: 3, 
        title: "Modern Art Gala", 
        location: "Metropolitan Gallery", 
        date: "Oct 24, 2024", 
        category: "ART", 
        categoryColor: "#8b8b6e",
        shortName: "ART" 
    },
    { 
        id: 5, 
        title: "Startup Launchpad", 
        location: "Innovation Hub", 
        date: "Nov 15, 2024", 
        category: "BUSINESS", 
        categoryColor: "#7b9e87",
        shortName: "BUS" 
    },
    { 
        id: 7, 
        title: "React Workshop", 
        location: "Tech Campus", 
        date: "Dec 15, 2024", 
        category: "TECHNOLOGY", 
        categoryColor: "#c97b7b",
        shortName: "TECH" 
    },
    { 
        id: 8, 
        title: "Marketing Strategy", 
        location: "Business Center", 
        date: "Jan 10, 2025", 
        category: "BUSINESS", 
        categoryColor: "#7b9e87",
        shortName: "BUS" 
    },
];

export default function RegisteredEvents() {
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [filteredEvents, setFilteredEvents] = useState(REGISTERED_EVENTS);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleApplyFilters = useCallback(() => {
        let filtered = REGISTERED_EVENTS.filter(event => {
            const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase()) || 
                                 event.location.toLowerCase().includes(query.toLowerCase()) ||
                                 event.category.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = category === "All Categories" || event.category === category;
            
            let matchesDate = true;
            if (date) {
                const selectedDate = new Date(date).toDateString();
                const eventDate = new Date(event.date).toDateString();
                matchesDate = selectedDate === eventDate;
            }
            
            return matchesQuery && matchesCategory && matchesDate;
        });
        setFilteredEvents(filtered);
    }, [query, category, date]);

    useEffect(() => {
        handleApplyFilters();
    }, [handleApplyFilters]);

    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans">
            <div className={`max-w-[1100px] mx-auto px-4 md:px-7 ${isMobile ? 'py-4' : 'py-8'} animate-in fade-in duration-700 space-y-8`}>
                
                {/* Search Bar */}
                <div className={`relative ${isMobile ? 'mb-5' : 'mb-8'}`}>
                    <div className="flex items-center bg-white rounded-full py-3.5 px-6 gap-3 shadow-sm border border-slate-50 focus-within:ring-4 focus-within:ring-[#5CB85C]/10 transition-all">
                        <Search size={18} className="text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="Search registered events..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-none outline-none flex-1 text-sm text-slate-700 bg-transparent placeholder-slate-300 font-medium"
                        />
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-50 flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 w-full max-w-xs">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Event Date</label>
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 group focus-within:ring-2 focus-within:ring-[#5CB85C]/20 transition-all">
                            <Calendar size={14} className="text-slate-400 mr-2 group-focus-within:text-[#5CB85C]" />
                            <input 
                                type="date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-sm text-slate-700 font-medium cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-xs">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block ml-1">Category</label>
                        <div className="relative">
                            <select 
                                value={category} 
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#5CB85C]/20 transition-all"
                            >
                                <option>All Categories</option>
                                <option>UI/UX DESIGN</option>
                                <option>TECHNOLOGY</option>
                                <option>ART</option>
                                <option>BUSINESS</option>
                                <option>HEALTH</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                    </div>

                    <Button onClick={handleApplyFilters} className="px-8 py-3.5 h-auto">
                        Apply Filters
                    </Button>
                </div>

                {/* Events Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registered Events</h2>
                            <p className="text-slate-500 text-lg mt-1 font-medium select-none">You are currently registered for {REGISTERED_EVENTS.length} events</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                showButtons={true}
                                customActions={
                                    <div className="flex flex-col gap-3">
                                        <Button variant="primary" fullWidth className="py-2.5">
                                            Registered
                                        </Button>
                                        <Button variant="secondary" fullWidth className="py-2.5">
                                            View Details
                                        </Button>
                                    </div>
                                }
                            />
                        ))}
                    </div>

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                            <div className="text-5xl mb-4 opacity-20">🎟️</div>
                            <h3 className="text-xl font-bold text-slate-800">No registered events found</h3>
                            <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

