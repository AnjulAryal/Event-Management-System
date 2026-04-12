import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, User, Star, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminViewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const eventRes = await fetch(`/api/events/${id}`);
                let fetchedEvent = null;
                if (eventRes.ok) {
                    fetchedEvent = await eventRes.json();
                    setEvent(fetchedEvent);
                } else {
                    toast.error("Failed to load event details");
                    setLoading(false);
                    return;
                }

                const feedbackRes = await fetch('/api/feedback', {
                    headers: {
                        Authorization: user && user.token ? `Bearer ${user.token}` : ''
                    }
                });
                
                if (feedbackRes.ok) {
                    const allFeedbacks = await feedbackRes.json();
                    const eventFeedbacks = allFeedbacks.filter(f => f.title === fetchedEvent.title);
                    setFeedbacks(eventFeedbacks);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                toast.error("Error loading data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const res = await fetch(`/api/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: user && user.token ? `Bearer ${user.token}` : ''
                    }
                });
                if (res.ok) {
                    toast.success("Event deleted successfully!");
                    navigate('/admin-events');
                } else {
                    toast.error("Failed to delete event");
                }
            } catch (error) {
                toast.error("Failed to delete event");
            }
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-center font-bold text-slate-500">Loading details...</div>;
    }

    if (!event) {
        return <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-center font-bold text-slate-500">Event not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-800 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header Navigation */}
                <header className="flex justify-between items-center mb-8">
                    <div className="text-sm font-semibold text-slate-500">
                        Events {'>'} <span className="text-slate-900 font-bold">View Details</span>
                    </div>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-[#5CB85C] font-bold hover:text-green-700 transition"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </button>
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Image Container */}
                        <div className="relative rounded-[32px] overflow-hidden shadow-md h-[400px]">
                            {event.coverImage ? (
                                <img 
                                    src={event.coverImage.startsWith('data:image') || event.coverImage.startsWith('http') ? event.coverImage : `http://localhost:5000/${event.coverImage.replace(/^\/+/, '')}`}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#1c2331] flex justify-center items-center">
                                    <span className="text-white/20 text-6xl font-black">{event.title?.substring(0, 2).toUpperCase()}</span>
                                </div>
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20"></div>
                            
                            {/* Dynamic Badge */}
                            <div className="absolute bottom-6 left-6">
                                <span className={`text-white text-xs font-bold uppercase py-2 px-4 rounded-full shadow-lg ${
                                    new Date(event.date) < new Date() ? 'bg-slate-600' : 'bg-[#3b07d8]'
                                }`}>
                                    {(() => {
                                        try {
                                            const eDate = new Date(event.date);
                                            const today = new Date();
                                            eDate.setHours(0,0,0,0);
                                            today.setHours(0,0,0,0);
                                            const diff = Math.ceil((eDate - today) / (1000 * 60 * 60 * 24));
                                            if (isNaN(diff)) return "EVENT";
                                            if (diff === 0) return "LIVE TODAY";
                                            if (diff > 0) return `LIVE IN ${diff} DAY${diff > 1 ? 'S' : ''}`;
                                            return "PAST EVENT";
                                        } catch {
                                            return "EVENT";
                                        }
                                    })()}
                                </span>
                            </div>
                        </div>

                        {/* Event Content Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
                            <h1 className="text-2xl md:text-[32px] font-extrabold text-slate-900 mb-6 flex gap-2 leading-tight">
                                <span className="font-semibold text-slate-800 tracking-tight">Title:</span> {event.title}
                            </h1>
                            
                            <h3 className="text-[20px] font-bold text-slate-900 mb-4 tracking-tight">Description:</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {event.description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button 
                                    onClick={() => navigate(`/admin-edit-event/${id}`)}
                                    className="flex-1 bg-[#8A9BA8] hover:bg-[#788a99] text-slate-900 text-[20px] font-bold py-4 rounded-2xl shadow-sm transition-colors"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 bg-[#E53E3E] hover:bg-[#c92a2a] text-white text-[20px] font-bold py-4 rounded-2xl shadow-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                            <button 
                                onClick={() => navigate(`/admin-event-attendees/${id}`)}
                                className="w-full bg-[#5CB85C] hover:bg-[#4aa14a] text-white text-[20px] font-bold py-4 rounded-2xl shadow-sm transition-colors mt-2"
                            >
                                Attendees
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-[420px] flex flex-col gap-8">
                        {/* Details Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col gap-8">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <CalendarDays className="w-6 h-6 text-[#5CB85C]" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">DATE</p>
                                    <p className="text-[15px] font-bold text-slate-800">{event.date}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-[#5CB85C]" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">TIME</p>
                                    <p className="text-[15px] font-bold text-slate-800">{event.time}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-[#5CB85C]" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">VENUE</p>
                                    <p className="text-[15px] font-bold text-slate-800">{event.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-[#5CB85C]" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ORGANIZER</p>
                                    <p className="text-[15px] font-bold text-slate-800">{event.organizer || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rating Card */}
                        <div className="flex items-center gap-4 px-2">
                            <h3 className="text-[#5CB85C] font-extrabold uppercase tracking-wide">RATING</h3>
                            <div className="flex gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-[#EAB308] text-[#EAB308]" />
                                ))}
                            </div>
                        </div>

                        {/* Feedbacks Header */}
                        <div className="px-2">
                             <h3 className="text-[#5CB85C] font-extrabold uppercase tracking-wide">TOP LIKED FEEDBACKS</h3>
                        </div>

                        {/* Feedback List */}
                        <div className="flex flex-col gap-4">
                            {feedbacks.length > 0 ? feedbacks.map((fb) => (
                                <div key={fb._id || fb.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-50 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 mt-1"></div>
                                    <div className="flex-1 flex flex-col pt-0.5">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="font-bold text-[14px] text-slate-900">{fb.email}</span>
                                        </div>
                                        <p className="text-slate-400 text-[13px] font-medium leading-relaxed pr-2">
                                            {fb.feedback}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center text-slate-500 font-medium">
                                    No feedbacks found for this event.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminViewDetails;
