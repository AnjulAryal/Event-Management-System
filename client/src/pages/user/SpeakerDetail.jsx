import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, ChevronRight, ArrowLeft, CalendarDays } from "lucide-react";
import UserPageContainer from "../../components/user/UserPageContainer";
import UserSearch from "../../components/user/UserSearch";
import EventCard from "../../components/ui/EventCard";

// Helper: parse any date string into a comparable Date object
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (!isNaN(d)) return d;
    // Try formats like "Oct 24, 2024" or "Dec 01 - 02, 2024"
    const cleaned = dateStr.split('—')[0].split('-')[0].trim();
    const parsed = new Date(cleaned);
    return isNaN(parsed) ? null : parsed;
};

export default function SpeakerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [speaker, setSpeaker] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const currentUserId = storedUser._id ? String(storedUser._id) : "";

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch speaker
                const speakerRes = await fetch(`/api/speakers/${id}`);
                const speakerData = await speakerRes.json();
                setSpeaker(speakerData);

                // Fetch events linked to this speaker
                const eventsRes = await fetch(`/api/events/by-speaker/${id}`);
                const eventsData = await eventsRes.json();

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const mapped = (Array.isArray(eventsData) ? eventsData : []).map(e => ({
                    ...e,
                    id: e._id,
                    isRegistered: Array.isArray(e.registeredParticipants) &&
                        e.registeredParticipants.some(p => {
                            if (typeof p === "string") return p === currentUserId;
                            if (p?._id) return String(p._id) === currentUserId;
                            return false;
                        })
                }));

                // Split into upcoming vs past based on event date
                const upcoming = mapped.filter(e => {
                    const d = parseDate(e.date);
                    return d ? d >= today : true; // unknown date → treat as upcoming
                });

                const past = mapped.filter(e => {
                    const d = parseDate(e.date);
                    return d ? d < today : false;
                });

                setUpcomingEvents(upcoming);
                setPastEvents(past);
            } catch (error) {
                console.error("Error fetching speaker details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <UserPageContainer isMobile={isMobile}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-pulse text-slate-400 font-bold text-lg">Loading speaker...</div>
                </div>
            </UserPageContainer>
        );
    }

    if (!speaker) {
        return (
            <UserPageContainer isMobile={isMobile}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-slate-500 font-bold">Speaker not found</p>
                    <button onClick={() => navigate('/speakers')} className="text-[#5CB85C] font-bold flex items-center gap-1">
                        <ArrowLeft size={16} /> Back to Speakers
                    </button>
                </div>
            </UserPageContainer>
        );
    }

    const initials = speaker.initials || speaker.name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const totalEvents = upcomingEvents.length + pastEvents.length;

    // Filter events based on search query
    const filteredUpcoming = upcomingEvents.filter(e => 
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPast = pastEvents.filter(e => 
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <UserPageContainer isMobile={isMobile}>
            <UserSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search events..." />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-4">
                <button onClick={() => navigate('/speakers')} className="hover:text-[#5CB85C] transition-colors">
                    Speaker
                </button>
                <ChevronRight size={12} strokeWidth={3} />
                <span className="text-slate-900">ViewProfile</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-[35px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col md:flex-row gap-12 mb-10">
                {/* Avatar with Shadow */}
                <div className="flex-shrink-0">
                    <div className="w-52 h-52 rounded-[30px] bg-slate-100 relative group">
                        <div className="absolute inset-0 bg-white rounded-[30px] shadow-2xl shadow-slate-200/50 translate-x-3 translate-y-3 -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
                        <div className="w-full h-full rounded-[30px] overflow-hidden border-[6px] border-white shadow-sm">
                            {speaker.profilePic ? (
                                <img src={speaker.profilePic} alt={speaker.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#5CB85C] flex items-center justify-center text-white font-black text-6xl">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">{speaker.name}</h1>

                    <p className="text-[#5CB85C] text-xl font-bold">{speaker.role}</p>
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                        {speaker.bio || `${speaker.name} is a distinguished expert in ${speaker.category}. With extensive industry experience, they bring cutting-edge insights and practical knowledge to every session. A highly sought-after speaker and thought leader at top global conferences.`}
                    </p>
                </div>
            </div>

            {/* Stats Card */}
            <div className="mb-12">
                <div className="bg-white rounded-[25px] p-6 shadow-sm border border-slate-100 w-full max-w-[250px] flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[15px] bg-[#EEF9EE] flex items-center justify-center">
                        <Calendar size={28} className="text-[#5CB85C]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{totalEvents}</div>
                        <div className="text-sm text-slate-400 font-bold">Events Hosted</div>
                    </div>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="space-y-6 mb-12">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Upcoming Events</h2>
                    <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-wide">Don't miss {speaker.name?.split(' ')[0]}'s next live sessions</p>
                </div>
                {filteredUpcoming.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredUpcoming.map(e => (
                            <EventCard key={e.id} event={e} showButtons={true} />
                        ))}
                    </div>


                ) : (

                    <div className="bg-white rounded-[30px] p-16 text-center border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black text-xl">No upcoming events scheduled</p>
                        <p className="text-slate-300 font-bold mt-2">Check back soon for new sessions</p>
                    </div>
                )}
            </div>

            {/* Past Engagements */}
            <div className="space-y-6 pb-12">
                <h2 className="text-3xl font-black text-slate-900">Past Engagements</h2>
                {filteredPast.length > 0 ? (
                    <div className="space-y-4">
                        {filteredPast.map(e => (
                            <div
                                key={e.id}
                                onClick={() => navigate(`/event-details/${e.id}`)}
                                className="bg-white rounded-[25px] p-6 border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-pointer group"
                            >

                                <div className="w-16 h-16 rounded-[18px] overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                                    {e.coverImage ? (
                                        <img src={e.coverImage} alt={e.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#5CB85C] font-black text-xl">
                                            {(e.category || 'EV').substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-800 text-lg truncate group-hover:text-[#5CB85C] transition-colors">{e.title}</p>
                                    <p className="text-sm text-slate-400 font-bold">{e.location}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-sm font-black text-slate-800">{e.date}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mt-0.5">{e.venue || 'Global Summit'}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#5CB85C]/10 group-hover:text-[#5CB85C] transition-all">
                                    <ChevronRight size={20} strokeWidth={3} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[30px] p-12 text-center border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black">No past engagements recorded</p>
                    </div>
                )}
            </div>
        </UserPageContainer>
    );
}
