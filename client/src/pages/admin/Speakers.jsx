import { useState, useCallback, useEffect } from "react";
import { Search, MapPin, Calendar, ChevronRight } from "lucide-react";

const SPEAKERS = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "UX Director, Google",
        category: "UI/UX Design",
        event: "Design Summit 2024",
        date: "Dec 01 — 02, 2024",
        initials: "SC",
    },
    {
        id: 2,
        name: "Marcus Rodriguez",
        role: "CTO, TechForward",
        category: "Technology",
        event: "Design Summit 2024",
        date: "Dec 01 — 02, 2024",
        initials: "MR",
    },
    {
        id: 3,
        name: "Aisha Patel",
        role: "CEO, DesignCo",
        category: "Business",
        event: "Design Summit 2024",
        date: "Dec 01 — 02, 2024",
        initials: "AP",
    },
    {
        id: 4,
        name: "James Liu",
        role: "Product Lead, Meta",
        category: "UI/UX Design",
        event: "Design Summit 2024",
        date: "Dec 01 — 02, 2024",
        initials: "JL",
    },
    {
        id: 5,
        name: "Emma Wilson",
        role: "Sustainability Expert",
        category: "Business",
        event: "Design Summit 2024",
        date: "Dec 01 — 02, 2024",
        initials: "EW",
    },
    {
        id: 6,
        name: "David Kim",
        role: "AI Researcher, OpenAI",
        category: "Technology",
        event: "Design Summit 2024",
        date: "Dec 01 — 02, 2024",
        initials: "DK",
    },
];

const SpeakerCard = ({ speaker }) => (
    <div className="bg-white rounded-[18px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col gap-5 transition-all hover:shadow-[0_8px_35px_rgba(0,0,0,0.07)] hover:-translate-y-1">
        <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#71C171] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg shadow-green-200/50">
                {speaker.initials}
            </div>
            
            {/* Name & Role */}
            <div className="flex flex-col gap-1.5 pt-1">
                <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{speaker.name}</h3>
                <p className="text-[13px] text-gray-400 font-medium">{speaker.role}</p>
                <div className="mt-1">
                    <span className="px-3 py-1 bg-[#F1FAF1] text-[#5CB85C] text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {speaker.category}
                    </span>
                </div>
            </div>
        </div>

        {/* Event Details */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-50 mt-1">
            <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[12px] font-medium leading-none">Speaking at <span className="text-gray-700">{speaker.event}</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium leading-none">{speaker.date}</span>
            </div>
        </div>

        {/* View Profile Button */}
        <button className="w-full bg-[#EBF7EB] hover:bg-[#D7EED7] text-[#5CB85C] font-bold py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-1 transition-all mt-1 group">
            View Profile <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
    </div>
);

export default function Speakers() {
    const [query, setQuery] = useState("");
    const [filteredSpeakers, setFilteredSpeakers] = useState(SPEAKERS);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSearch = useCallback(() => {
        const q = query.toLowerCase();
        const filtered = SPEAKERS.filter(s => 
            s.name.toLowerCase().includes(q) || 
            s.role.toLowerCase().includes(q) || 
            s.category.toLowerCase().includes(q)
        );
        setFilteredSpeakers(filtered);
    }, [query]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    return (
        <div style={{ minHeight: "100vh", background: "#eef0ec", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px" : "24px 28px" }} className="animate-in fade-in duration-700">
                {/* Search Bar */}
                <div style={{ position: "relative", marginBottom: isMobile ? 20 : 32 }}>
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

                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Speakers</h1>
                    <p className="text-gray-400 text-[15px] mt-1 font-medium select-none">Meet our world-class speakers</p>
                </div>

                {/* Speakers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSpeakers.map(speaker => (
                        <SpeakerCard key={speaker.id} speaker={speaker} />
                    ))}
                </div>

                {filteredSpeakers.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-8">
                        <div className="text-4xl mb-4 opacity-40">👥</div>
                        <h3 className="text-xl font-bold text-gray-800">No speakers match your search</h3>
                        <p className="text-gray-400 mt-1">Try searching for a different name or category</p>
                    </div>
                )}
            </div>
        </div>
    );
}
