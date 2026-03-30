import { useState, useEffect, useRef, useCallback } from "react";

const EVENTS = [
    { id: 1, title: "UI/UX Design Summit", location: "Creative Hub, NYC", date: "Apr 01, 2026", category: "UI/UX DES", categoryColor: "#6c8ebf" },
    { id: 2, title: "DevCorps 2024", location: "Main Auditorium", date: "Apr 28, 2026", category: "TECHNOLOG", categoryColor: "#c97b7b" },
    { id: 3, title: "Modern Art Gala", location: "Metropolitan Gallery", date: "Apr 05, 2026", category: "ART", categoryColor: "#8b8b6e" },
    { id: 4, title: "React Summit 2024", location: "Tech Center, SF", date: "Apr 15, 2026", category: "TECHNOLOG", categoryColor: "#c97b7b" },
    { id: 5, title: "Brand Strategy Workshop", location: "Downtown Hub", date: "Nov 30, 2026", category: "BUSINESS", categoryColor: "#7b9e87" },
    { id: 6, title: "Photography Expo", location: "Art District", date: "Dec 10, 2026", category: "ART", categoryColor: "#8b8b6e" },
];

const CardImage = ({ category, categoryColor }) => (
    <div style={{
        background: "linear-gradient(135deg, #1a2744 0%, #0f1a35 50%, #1e2d4a 100%)",
        height: 120,
        borderRadius: "10px 10px 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    }}>
        <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 48, fontWeight: 900, letterSpacing: -2, fontFamily: "Georgia, serif" }}>UX</span>
        {category && (
            <span style={{
                position: "absolute", top: 10, right: 10,
                background: categoryColor || "#555",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 0.5,
                padding: "3px 8px",
                borderRadius: 20,
                fontFamily: "monospace",
                textTransform: "uppercase",
            }}>{category}</span>
        )}
    </div>
);

const EventCard = ({ event, showButtons = true }) => (
    <div style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        overflow: "hidden",
        flex: "1 1 0",
        minWidth: 0,
    }}>
        <CardImage category={event.category} categoryColor={event.categoryColor} />
        <div style={{ padding: "12px 14px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>{event.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                <span style={{ color: "#e05555", fontSize: 11 }}>📍</span>
                <span style={{ fontSize: 12, color: "#555", fontFamily: "system-ui, sans-serif" }}>{event.location}</span>
            </div>
            {event.date && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: showButtons ? 12 : 0 }}>
                    <span style={{ fontSize: 11 }}>📅</span>
                    <span style={{ fontSize: 12, color: "#555", fontFamily: "system-ui, sans-serif" }}>{event.date}</span>
                </div>
            )}
            {showButtons && (
                <>
                    <button style={{
                        width: "100%", background: "#4caf50", color: "#fff",
                        border: "none", borderRadius: 8, padding: "9px 0",
                        fontWeight: 700, fontSize: 13, cursor: "pointer",
                        fontFamily: "system-ui, sans-serif",
                        marginBottom: 6, transition: "background 0.15s",
                    }}
                        onMouseEnter={e => e.target.style.background = "#43a047"}
                        onMouseLeave={e => e.target.style.background = "#4caf50"}
                    >Register Now</button>
                    <button style={{
                        width: "100%", background: "transparent", color: "#555",
                        border: "none", padding: "6px 0",
                        fontWeight: 500, fontSize: 13, cursor: "pointer",
                        fontFamily: "system-ui, sans-serif",
                    }}>View Details</button>
                </>
            )}
        </div>
    </div>
);

const SearchDropdown = ({ results, loading, visible }) => {
    if (!visible) return null;
    return (
        <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#fff", borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            zIndex: 100, overflow: "hidden",
            border: "1px solid #e8e8e8",
        }}>
            {loading ? (
                <div style={{ padding: "14px 18px", color: "#888", fontSize: 13, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #4caf50", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Searching...
                </div>
            ) : results.length === 0 ? (
                <div style={{ padding: "14px 18px", color: "#888", fontSize: 13, fontFamily: "system-ui, sans-serif" }}>No events found</div>
            ) : (
                results.map((r, i) => (
                    <div key={i} style={{
                        padding: "11px 18px",
                        borderBottom: i < results.length - 1 ? "1px solid #f0f0f0" : "none",
                        cursor: "pointer",
                        transition: "background 0.1s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f7faf7"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a", fontFamily: "system-ui, sans-serif" }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: "#888", fontFamily: "system-ui, sans-serif", marginTop: 2 }}>{r.location} · {r.date}</div>
                    </div>
                ))
            )}
        </div>
    );
};

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

        // If not searching, only show 'Popular' (top 3)
        // If searching/filtering, show all specific results
        setDisplayedEvents(isSearching ? filtered : filtered.slice(0, 3));
    }, [query, category, date]);

    useEffect(() => {
        filterEvents();
    }, [filterEvents]);

    const inputRef = useRef(null);

    return (
        <div style={{ minHeight: "100vh", background: "#eef0ec", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 28px" }}>

                {/* Search Bar */}
                <div className="search-wrapper" style={{ position: "relative", marginBottom: 28 }}>
                    <div style={{
                        display: "flex", alignItems: "center",
                        background: "#fff", borderRadius: 50,
                        padding: isMobile ? "8px 16px" : "10px 20px", gap: 10,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search events..."
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

                {/* Welcome */}
                <div style={{ marginBottom: 22 }}>
                    <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
                        Welcome back, <span style={{ color: "#4caf50" }}>Anjul</span>
                    </h1>
                    <p style={{ color: "#888", fontSize: 13, margin: "5px 0 0" }}>You have {upcomingCount} events coming up!</p>
                </div>

                {/* Filters */}
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
                    <div style={{ flex: isMobile ? "1" : "0 0 200px" }}>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Event Date</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #f3f4f6", borderRadius: 10, padding: "10px 14px", background: "#fff" }}>
                            <span style={{ fontSize: 14, opacity: 0.7 }}>📅</span>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                style={{ border: "none", outline: "none", fontSize: 13, color: "#1f2937", background: "transparent", fontFamily: "inherit", width: "100%", cursor: "pointer" }} />
                        </div>
                    </div>
                    <div style={{ flex: isMobile ? "1" : "0 0 200px" }}>
                        <label style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            style={{ width: "100%", border: "1.5px solid #f3f4f6", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#1f2937", background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer", appearance: "none" }}>
                            <option>All Categories</option>
                            <option>UI/UX Design</option>
                            <option>Technology</option>
                            <option>Art</option>
                            <option>Business</option>
                        </select>
                    </div>
                    <div style={{ 
                        marginLeft: isMobile ? "0" : "auto",
                        marginTop: isMobile ? "8px" : "0"
                    }}>
                        <button 
                            onClick={hasActiveFilters ? resetFilters : filterEvents}
                            style={{
                                width: isMobile ? "100%" : "auto",
                                background: hasActiveFilters ? "#f3f4f6" : "#3cb95e", 
                                color: hasActiveFilters ? "#4b5563" : "#fff", 
                                border: "none",
                                borderRadius: 10, 
                                padding: "12px 28px",
                                fontWeight: 700, 
                                fontSize: "13.5px", 
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: hasActiveFilters ? "none" : "0 4px 12px rgba(60,185,94,0.25)",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                if (!hasActiveFilters) e.currentTarget.style.background = "#27a04a";
                                else e.currentTarget.style.background = "#e5e7eb";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                if (!hasActiveFilters) e.currentTarget.style.background = "#3cb95e";
                                else e.currentTarget.style.background = "#f3f4f6";
                            }}
                        >
                            {hasActiveFilters ? (
                                <>
                                    <span style={{ fontSize: '16px' }}>↺</span>
                                    <span>Clear Filters</span>
                                </>
                            ) : (
                                "Apply Filters"
                            )}
                        </button>
                    </div>
                </div>

                {/* Popular Events */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
                            {query || category !== "All Categories" || date ? "Search Results" : "Popular Events"}
                        </h2>
                        <a href="#" style={{ color: "#4caf50", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            View all <span style={{ fontSize: 16 }}>→</span>
                        </a>
                    </div>
                    
                    {displayedEvents.length === 0 ? (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b7280", background: "#fff", borderRadius: 12 }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                            <div style={{ fontWeight: 600 }}>No events match your criteria</div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
                        </div>
                    ) : (
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 20 
                        }}>
                            {displayedEvents.map(e => <EventCard key={e.id} event={e} showButtons={true} />)}
                        </div>
                    )}
                </div>

                {/* Recommended */}
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 16 }}>Recommend for You</h2>
                    <div style={{ display: "flex", gap: 16 }}>
                        {EVENTS.slice(0, 3).map(e => <EventCard key={`rec-${e.id}`} event={{ ...e, date: undefined }} showButtons={false} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}