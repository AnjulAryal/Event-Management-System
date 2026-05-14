import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, User, ChevronRight, BadgeInfo, Star, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import UserPageContainer from "../../components/user/UserPageContainer";
import Button from "../../components/ui/Button";
import { parseEventDate, toLocalMidnight } from "../../utils/eventDates";

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [event, setEvent] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const currentUserId = currentUser?._id ? String(currentUser._id) : "";

    const isParticipantMatch = (participant) => {
        if (!participant || !currentUserId) return false;
        if (typeof participant === "string") return participant === currentUserId;
        if (typeof participant === "object") {
            if (participant._id) return String(participant._id) === currentUserId;
            if (participant.id) return String(participant.id) === currentUserId;
        }
        return String(participant) === currentUserId;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch event details
                const eventRes = await fetch(`/api/events/${id}`);
                const eventData = await eventRes.json();

                if (!eventRes.ok) {
                    throw new Error(eventData.message || "Failed to load event details");
                }

                setEvent(eventData);

                // Fetch feedback for this event
                const feedbackRes = await fetch(`/api/feedback/event/${encodeURIComponent(eventData.title)}`);
                if (feedbackRes.ok) {
                    const eventFeedbacks = await feedbackRes.json();
                    setFeedbacks(eventFeedbacks);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.message || "Failed to load details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [id]);

    const handleCancelRegistration = async () => {
        if (!event) {
            toast.error("Event details are still loading");
            return;
        }

        if (!currentUser?.token || !currentUser?._id) {
            toast.error("Please login again to continue");
            return;
        }

        const loadingToast = toast.loading("Cancelling your registration...");
        setIsCancelling(true);

        try {
            const res = await fetch(`/api/events/${id}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify({ userId: currentUser._id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to cancel registration");
            }

            toast.success("Registration cancelled", { id: loadingToast });
            setTimeout(() => navigate("/user-events"), 900);
        } catch (error) {
            console.error("Cancel registration error:", error);
            toast.error(error.message || "Could not cancel registration", { id: loadingToast });
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <UserPageContainer isMobile={isMobile}>
                <div className="flex h-[60vh] items-center justify-center text-slate-500 font-bold">
                    Loading event details...
                </div>
            </UserPageContainer>
        );
    }

    if (!event) {
        return (
            <UserPageContainer isMobile={isMobile}>
                <div className="flex h-[60vh] items-center justify-center text-slate-500 font-bold">
                    Event not found.
                </div>
            </UserPageContainer>
        );
    }

    const details = [
        { icon: <Calendar size={18} className="text-green-600" />, label: "DATE", value: event.date || "TBA", bg: "bg-green-50" },
        { icon: <Clock size={18} className="text-yellow-600" />, label: "TIME", value: event.time || "TBA", bg: "bg-yellow-50" },
        { icon: <MapPin size={18} className="text-blue-600" />, label: "VENUE", value: event.venue || event.location || "TBA", bg: "bg-blue-50" },
        { icon: <User size={18} className="text-purple-600" />, label: "ORGANIZER", value: event.organizer || "Eventify", bg: "bg-purple-50" },
    ];

    const isRegistered = Boolean(
        currentUserId &&
        Array.isArray(event.registeredParticipants) &&
        event.registeredParticipants.some(isParticipantMatch)
    );
    const parsedEventDate = parseEventDate(event?.date);
    const todayStart = toLocalMidnight(new Date());
    const eventDateStart = parsedEventDate ? toLocalMidnight(parsedEventDate) : null;
    const isPastEvent = Boolean(eventDateStart && eventDateStart < todayStart);
    const isTodayEvent = Boolean(eventDateStart && eventDateStart.getTime() === todayStart.getTime());
    const isAttendedEvent = Boolean(
        isRegistered &&
        isPastEvent
    );

    const eventTitle = event.title || "Untitled Event";
    const eventDescription = event.description || "No description available for this event.";
    const eventImage =
        event.coverImage ||
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";
    const fromAttended = location.state?.from === "attended-events";
    const breadcrumbLabel = fromAttended ? "Attended Events" : "Events";
    const breadcrumbPath = fromAttended ? "/attended-events" : "/user-events";
    const showClosedState = fromAttended && isPastEvent;

    return (
        <UserPageContainer isMobile={isMobile}>
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 px-1">
                <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate(breadcrumbPath)}>
                    {breadcrumbLabel}
                </span>
                <ChevronRight size={14} />
                <span className="text-slate-900">View Details</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1 space-y-10">
                    <div className="relative rounded-[32px] overflow-hidden shadow-xl aspect-video group">
                        <img
                            src={eventImage}
                            alt={eventTitle}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8">
                            <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                {showClosedState ? "Event Closed" : isAttendedEvent ? "Attended Event" : isRegistered ? "Registered Event" : "Event Details"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-800">
                                <BadgeInfo size={20} className="text-[#5CB85C]" />
                                <h3 className="text-lg font-extrabold tracking-tight">Event Overview</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-2xl font-black text-slate-900 tracking-tight">{eventTitle}</span>
                                    {event.category && (
                                        <span
                                            className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2 rounded-full"
                                            style={{
                                                color: event.categoryColor || "#5CB85C",
                                                backgroundColor: `${event.categoryColor || "#5CB85C"}14`,
                                            }}
                                        >
                                            {event.category}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-black text-slate-900 mb-2">Description</h4>
                                    <p className="text-sm leading-7 text-slate-500 font-medium">{eventDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings & Feedbacks Section - Only shown for events that have started or ended */}
                    {(isPastEvent || isTodayEvent) && (
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                                <div className="flex items-center gap-3 text-slate-800">
                                    <MessageSquare size={20} className="text-[#5CB85C]" />
                                    <h3 className="text-lg font-extrabold tracking-tight">Ratings & Feedbacks</h3>
                                </div>
                                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => {
                                            const avgRating = feedbacks.length > 0 
                                                ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length 
                                                : 0;
                                            return (
                                                <Star 
                                                    key={i} 
                                                    size={14} 
                                                    className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                                                />
                                            );
                                        })}
                                    </div>
                                    <span className="text-xs font-black text-yellow-700">
                                        {feedbacks.length > 0 
                                            ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) 
                                            : "0.0"}
                                    </span>
                                    <span className="text-[10px] font-bold text-yellow-600/60 uppercase tracking-wider">
                                        ({feedbacks.length} Reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                {feedbacks.length > 0 ? (
                                    feedbacks.map((fb, idx) => (
                                        <div key={fb._id || idx} className="group p-6 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#5CB85C]/10 flex items-center justify-center text-[#5CB85C] font-black text-xs uppercase">
                                                        {fb.email?.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{fb.email}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fb.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={10} 
                                                            className={i < fb.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm leading-relaxed text-slate-600 font-medium">
                                                {fb.feedback}
                                            </p>
                                            {fb.adminReply?.message && (
                                                <div className="mt-4 p-4 rounded-xl bg-white border border-green-50">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]"></div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5CB85C]">Organizer Response</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-slate-500 font-medium italic">
                                                        "{fb.adminReply.message}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/30 rounded-[24px] border border-dashed border-slate-200">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                            <MessageSquare size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-400">No feedbacks yet</p>
                                            <p className="text-[10px] font-medium text-slate-400">Be the first to share your experience!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-[360px] lg:sticky lg:top-8">
                    <div className="bg-white rounded-[32px] px-7 py-8 md:px-8 md:py-9 shadow-[0_18px_50px_rgba(15,23,42,0.08)] border border-white/80 space-y-8">
                        <div>
                            <h1 className="text-[2rem] leading-[1.05] font-extrabold text-slate-900 tracking-[-0.04em]">
                                {eventTitle}
                            </h1>
                        </div>

                        <div className="space-y-4">
                            {details.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-300">{item.label}</p>
                                        <p className="text-[15px] leading-5 font-bold text-slate-700 break-words">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-1 text-center">
                            {showClosedState ? (
                                <>
                                    <div className="w-full bg-[#7A96C6] text-white py-4 rounded-[18px] text-base font-black border border-[#6E88B6] shadow-[0_10px_24px_rgba(122,150,198,0.28)]">
                                        Event Closed
                                    </div>
                                    <p className="text-[10px] leading-4 text-slate-400 font-medium px-5 max-w-[260px] mx-auto">
                                        This event has already concluded.
                                    </p>
                                </>
                            ) : isAttendedEvent ? (
                                <>
                                    <div className="w-full bg-[#7A96C6] text-white py-4 rounded-[18px] text-base font-black border border-[#6E88B6] shadow-[0_10px_24px_rgba(122,150,198,0.28)]">
                                        Attended Event
                                    </div>
                                    <p className="text-[10px] leading-4 text-slate-400 font-medium px-5 max-w-[260px] mx-auto">
                                        This event has ended and is now listed under your attended events.
                                    </p>
                                </>
                            ) : isRegistered ? (
                                <>
                                    <Button
                                        onClick={handleCancelRegistration}
                                        isLoading={isCancelling}
                                        className="w-full bg-[#FF5A5F] hover:bg-[#f24b51] text-white py-4 rounded-[18px] text-base font-black shadow-[0_14px_28px_rgba(255,90,95,0.24)] flex items-center justify-center h-auto"
                                    >
                                        Cancel
                                    </Button>
                                    <p className="text-[10px] leading-4 text-slate-400 font-medium px-5 max-w-[260px] mx-auto">
                                        If you cancel, this event will be removed from your My Events page.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => navigate(`/complete-registration/${id}`)}
                                        className="w-full bg-[#7AC943] hover:bg-[#6dbc39] text-white py-4 rounded-[18px] text-base font-black shadow-[0_14px_28px_rgba(122,201,67,0.24)] flex items-center justify-center h-auto"
                                    >
                                        Register Now
                                    </Button>
                                    <p className="text-[10px] leading-4 text-slate-400 font-medium px-5 max-w-[260px] mx-auto">
                                        You can register for this event to have it added to your My Events page.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserPageContainer>
    );
}
