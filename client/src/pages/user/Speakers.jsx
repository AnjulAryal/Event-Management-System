import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import SpeakerCard from "../../components/ui/SpeakerCard";

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
        event: "Tech World 2024",
        date: "Nov 15 — 16, 2024",
        initials: "MR",
    },
    {
        id: 3,
        name: "Aisha Patel",
        role: "CEO, DesignCo",
        category: "Business",
        event: "Startup Expo 2024",
        date: "Oct 10 — 11, 2024",
        initials: "AP",
    },
    {
        id: 4,
        name: "James Liu",
        role: "Product Lead, Meta",
        category: "UI/UX Design",
        event: "UX Conf 2024",
        date: "Sep 22 — 23, 2024",
        initials: "JL",
    },
    {
        id: 5,
        name: "Emma Wilson",
        role: "Sustainability Expert",
        category: "Business",
        event: "Eco Summit 2024",
        date: "Aug 05 — 06, 2024",
        initials: "EW",
    },
    {
        id: 6,
        name: "David Kim",
        role: "AI Researcher, OpenAI",
        category: "Technology",
        event: "AI Workshop 2024",
        date: "Jul 18 — 19, 2024",
        initials: "DK",
    },
];

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
        <div className="min-h-screen bg-[#eef0ec] font-sans">
            <div className={`max-w-[1100px] mx-auto px-4 md:px-7 ${isMobile ? 'py-4' : 'py-8'} animate-in fade-in duration-700`}>
                {/* Search Bar */}
                <div className={`relative ${isMobile ? 'mb-5' : 'mb-10'}`}>
                    <div className="flex items-center bg-white rounded-full py-3.5 px-6 gap-3 shadow-sm border border-slate-50 focus-within:ring-4 focus-within:ring-[#5CB85C]/10 transition-all">
                        <Search size={18} className="text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="Search speakers by name, role or category..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-none outline-none flex-1 text-sm text-slate-700 bg-transparent placeholder-slate-300 font-medium"
                        />
                    </div>
                </div>

                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Speakers</h1>
                    <p className="text-slate-500 text-lg mt-1 font-medium select-none">Meet our world-class speakers</p>
                </div>

                {/* Speakers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSpeakers.map(speaker => (
                        <SpeakerCard 
                            key={speaker.id} 
                            speaker={speaker} 
                            onViewProfile={(s) => console.log('View Profile', s.name)}
                        />
                    ))}
                </div>

                {filteredSpeakers.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-100 mt-8">
                        <div className="text-5xl mb-4 opacity-20">👥</div>
                        <h3 className="text-xl font-bold text-slate-800">No speakers match your search</h3>
                        <p className="text-slate-400 mt-2 font-medium">Try searching for a different name or category</p>
                    </div>
                )}
            </div>
        </div>
    );
}

