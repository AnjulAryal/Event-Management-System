import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Calendar, Clock, MapPin, User, Star, Heart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Adminviewdetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const found = storedEvents.find(e => e.id === id);
        
        if (found) {
            setEvent({
                ...found,
                description: found.description || "A masterclass in digital orchestration, focusing on the intersection of AI-driven interfaces and editorial design principles. For the visionary creator. A masterclass in digital orchestration, focusing on the intersection of AI-driven interfaces and editorial design principles. For the visionary creator.",
                time: found.time || "09:00 AM - 05:00 PM EST",
                venue: found.venue || found.location || "The Glass Pavilion, NYC",
                organizer: found.organizer || "Orchestra Creative Labs",
                date: found.date || "October 24, 2024"
            });
        }
    }, [id]);

    if (!event) {
        return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans pb-12 flex flex-col">
            {/* Top Navigation Bar / Search Header (shared header style) */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="relative w-full max-w-lg group">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full bg-slate-50 border border-slate-200 text-[13px] rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8">
                
                {/* Breadcrumbs & Back */}
                <div className="flex items-center justify-between mb-6">
                    <div className="text-[13px] font-bold text-slate-500">
                        Events <span className="mx-1.5 font-normal text-slate-300">›</span> <span className="text-slate-800">View Details</span>
                    </div>
                    <button 
                        onClick={() => navigate('/admin-events')}
                        className="flex items-center text-green-600 font-bold text-sm hover:text-green-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.5fr_1fr] gap-10">
                    
                    {/* Left Column */}
                    <div className="flex flex-col">
                        
                        {/* Event Hero Image */}
                        <div className="rounded-[24px] overflow-hidden relative shadow-md mb-8 bg-slate-900 aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9]">
                            {/* Using a placeholder gradient image since we don't have the real asset */}
                            <div 
                                className="w-full h-full object-cover"
                                style={{ background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)' }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                    <div className="w-[120%] h-[200px] bg-blue-500 rounded-[100%] blur-[100px] rotate-[-15deg] translate-y-20"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-5 left-5">
                                <span className="bg-[#4338ca] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                                    LIVE IN 3 DAYS
                                </span>
                            </div>
                        </div>

                        {/* Title & Description Box */}
                        <div className="bg-white p-6 md:p-8 mb-6 border-[3px] border-[#2582eb]">
                            <h2 className="text-[28px] md:text-[34px] font-black text-slate-900 mb-8 leading-tight tracking-tight flex flex-row items-baseline gap-3">
                                <span className="text-[22px] font-bold text-slate-800 tracking-normal">Title:</span>
                                {event.title}
                            </h2>
                            <h3 className="text-[18px] font-bold text-slate-900 mb-3">Description:</h3>
                            <p className="text-slate-500 leading-[1.8] text-[14px]">
                                {event.description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => navigate(`/admin-edit-event/${event.id}`)}
                                className="bg-[#939cae] hover:bg-[#838c9e] active:bg-slate-500 text-slate-900 font-bold py-3 md:py-4 rounded-[12px] text-[20px] border-[5px] border-[#cbd5e1] transition-all flex items-center justify-center outline-none"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => {
                                    if(window.confirm("Are you sure you want to delete this event?")) {
                                        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
                                        localStorage.setItem('events', JSON.stringify(storedEvents.filter(e => e.id !== event.id)));
                                        toast.success("Event deleted!");
                                        navigate('/admin-events');
                                    }
                                }}
                                className="bg-[#e43a3a] hover:bg-red-600 active:bg-red-700 text-white font-bold py-3 md:py-4 rounded-[12px] text-[20px] border-[5px] border-[#fca5a5] transition-all focus:outline-none"
                            >
                                Delete
                            </button>
                        </div>
                        <button 
                            onClick={() => navigate(`/admin-event-attendees/${event.id}`)}
                            className="mt-4 w-full bg-[#5CB85C] hover:bg-[#4aa14a] active:bg-[#3d8b3d] text-white font-bold py-3 md:py-4 rounded-[12px] text-[20px] border-[5px] border-[#9ce29c] transition-all focus:outline-none"
                        >
                            Attendees
                        </button>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col">
                        
                        {/* Info List */}
                        <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-50 mb-10 space-y-7">
                            {/* Date */}
                            <div className="flex items-start gap-4">
                                <div className="bg-[#f0fbf0] p-2.5 rounded-[10px] flex items-center justify-center mt-0.5">
                                    <Calendar className="text-[#5CB85C] w-[18px] h-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-bold text-slate-800 text-[15px]">{event.date}</p>
                                </div>
                            </div>
                            
                            {/* Time */}
                            <div className="flex items-start gap-4">
                                <div className="bg-[#f0fbf0] p-2.5 rounded-[10px] flex items-center justify-center mt-0.5">
                                    <Clock className="text-[#5CB85C] w-[18px] h-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                                    <p className="font-bold text-slate-800 text-[15px]">{event.time}</p>
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="flex items-start gap-4">
                                <div className="bg-[#f0fbf0] p-2.5 rounded-[10px] flex items-center justify-center mt-0.5">
                                    <MapPin className="text-[#5CB85C] w-[18px] h-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Venue</p>
                                    <p className="font-bold text-slate-800 text-[15px] leading-snug">{event.venue}</p>
                                </div>
                            </div>

                            {/* Organizer */}
                            <div className="flex items-start gap-4">
                                <div className="bg-[#f0fbf0] p-2.5 rounded-[10px] flex items-center justify-center mt-0.5">
                                    <User className="text-[#5CB85C] w-[18px] h-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Organizer</p>
                                    <p className="font-bold text-slate-800 text-[15px]">{event.organizer}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-5 mb-8 pl-3">
                            <span className="text-[#5CB85C] font-bold uppercase tracking-widest text-[12px]">Rating</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="text-[#facc15] fill-[#facc15] w-5 h-5" />
                                ))}
                            </div>
                        </div>

                        {/* Feedbacks */}
                        <div className="pl-3">
                            <h4 className="text-[#5CB85C] font-bold uppercase tracking-widest text-[12px] mb-4">Top Liked Feedbacks</h4>
                            
                            <div className="space-y-4">
                                {/* Feedback Card Component */}
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-slate-50 flex gap-4 items-center transition-transform hover:-translate-y-1">
                                        <div className="w-11 h-11 bg-[#e0f5e0] rounded-full flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h5 className="font-bold text-slate-900 text-[13px]">ghimirearnav738@gmail</h5>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-slate-500 text-[11px] font-medium">5.6k</span>
                                                    <Heart className="text-[#ef4444] fill-[#ef4444] w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                                                The Event was so coooool. Enjoyed every second of it
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Adminviewdetails;
