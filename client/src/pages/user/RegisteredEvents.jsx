import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, MapPin, ChevronDown } from "lucide-react";

// Simulated registered events
const REGISTERED_EVENTS = [
    { 
        id: 1, 
        title: "UI/UX Design Summit", 
        location: "Creative Hub, NYC", 
        date: "Dec 01, 2024", 
        category: "UI/UX DES", 
        categoryColor: "rgba(108, 142, 191, 0.4)",
        shortName: "UX" 
    },
    { 
        id: 3, 
        title: "Modern Art Gala", 
        location: "Metropolitan Gallery", 
        date: "Oct 24, 2024", 
        category: "ART", 
        categoryColor: "rgba(139, 139, 110, 0.4)",
        shortName: "UX" 
    },
    { 
        id: 5, 
        title: "Startup Launchpad", 
        location: "Innovation Hub", 
        date: "Nov 15, 2024", 
        category: "BUSINESS", 
        categoryColor: "rgba(123, 158, 135, 0.4)",
        shortName: "UX" 
    },
    { 
        id: 7, 
        title: "React Workshop", 
        location: "Tech Campus", 
        date: "Dec 15, 2024", 
        category: "TECHNOLOG", 
        categoryColor: "rgba(201, 123, 123, 0.4)",
        shortName: "UX" 
    },
    { 
        id: 8, 
        title: "Marketing Strategy", 
        location: "Business Center", 
        date: "Jan 10, 2025", 
        category: "BUSINESS", 
        categoryColor: "rgba(123, 158, 135, 0.4)",
        shortName: "UX" 
    },
];

const EventCard = ({ event }) => (
    <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
        {/* Card Header/Image */}
        <div className="relative h-[160px] flex items-center justify-center overflow-hidden" 
             style={{ background: "linear-gradient(180deg, #1A2743 0%, #0D162B 100%)" }}>
            <span className="text-white/10 text-[60px] font-black tracking-tighter select-none">{event.shortName}</span>
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-widest"
                 style={{ color: event.categoryColor.replace('0.4', '1'), background: event.categoryColor }}>
                {event.category}
            </div>
        </div>
        
        {/* Card Content */}
        <div className="p-5 flex flex-col gap-3">
            <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-tight">{event.title}</h3>
            
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[13px] font-medium">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[13px] font-medium">{event.date}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <button className="w-full bg-[#5CB85C] hover:bg-[#4AA14A] text-white font-bold py-2.5 rounded-lg text-[14px] transition-colors">
                    Registered
                </button>
                <button className="w-full bg-[#F8F9FA] hover:bg-[#E9ECEF] text-gray-600 font-bold py-2.5 rounded-lg text-[14px] transition-colors border border-gray-100">
                    View Details
                </button>
            </div>
        </div>
    </div>
);

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
        <div style={{ minHeight: "100vh", background: "#eef0ec", fontFamily: "system-ui, -apple-system, sans-serif" }} className="transition-all duration-300">
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px" : "24px 28px" }} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                
                {/* Global Search Bar */}
                <div style={{ position: "relative", marginBottom: isMobile ? 20 : 28 }}>
                    <div style={{
                        display: "flex", alignItems: "center",
                        background: "#fff", borderRadius: 50,
                        padding: isMobile ? "8px 16px" : "10px 20px", gap: 10,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    }}>
                        <Search size={16} color="#aaa" strokeWidth={2.2} />
                        <input 
                            type="text" 
                            placeholder=""
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{
                                border: "none", outline: "none", flex: 1,
                                fontSize: 14, color: "#333", background: "transparent",
                                fontFamily: "system-ui, sans-serif",
                            }}
                        />
                    </div>
                </div>

                {/* Filters Box */}
                <div style={{
                    background: "#fff", borderRadius: 12,
                    padding: isMobile ? "20px" : "16px 24px", 
                    marginBottom: 28,
                    display: "flex", 
                    flexDirection: isMobile ? "column" : "row",
                    flexWrap: "wrap",
                    alignItems: isMobile ? "stretch" : "flex-end", 
                    gap: isMobile ? "12px" : "20px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    border: "1px solid #f0f0f0",
                }}>
                    <div style={{ flex: isMobile ? "1" : "0 0 240px" }}>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Event Date</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #f3f4f6", borderRadius: 10, padding: "10px 14px", background: "#fff" }}>
                            <Calendar size={14} className="opacity-70" />
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                style={{ border: "none", outline: "none", fontSize: 13, color: "#1f2937", background: "transparent", fontFamily: "inherit", width: "100%", cursor: "pointer" }} />
                        </div>
                    </div>

                    <div style={{ flex: isMobile ? "1" : "0 0 240px" }}>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Category</label>
                        <div style={{ position: "relative" }}>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                style={{ width: "100%", border: "1.5px solid #f3f4f6", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#1f2937", background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer", appearance: "none" }}>
                                <option>All Categories</option>
                                <option>UI/UX DES</option>
                                <option>TECHNOLOG</option>
                                <option>ART</option>
                                <option>BUSINESS</option>
                                <option>HEALTH</option>
                            </select>
                            <ChevronDown size={14} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
                        </div>
                    </div>

                    <button 
                        onClick={handleApplyFilters}
                        style={{
                            marginLeft: isMobile ? "0" : "auto",
                            background: "#3cb95e", 
                            color: "#fff", 
                            border: "none",
                            borderRadius: 10, 
                            padding: "12px 28px",
                            fontWeight: 700, 
                            fontSize: "13.5px", 
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: "0 4px 12px rgba(60,185,94,0.25)",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#27a04a"}
                        onMouseLeave={e => e.currentTarget.style.background = "#3cb95e"}
                    >
                        Apply Filters
                    </button>
                </div>

                {/* Events Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[24px] font-black text-[#1A1A1A]">My Registered Events</h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">You are currently registered for {REGISTERED_EVENTS.length} events</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 animate-in zoom-in-95 duration-500">
                            <div className="text-5xl mb-4 opacity-50">🎟️</div>
                            <h3 className="text-xl font-bold text-gray-800">No registered events found</h3>
                            <p className="text-gray-500 max-w-[300px] mx-auto mt-2">Adjust your search or filter settings to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
