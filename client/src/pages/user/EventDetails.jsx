import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Send, ChevronRight, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import UserPageContainer from "../../components/user/UserPageContainer";
import Button from "../../components/ui/Button";

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        toast.success("Message sent to organizer!");
    };

    const details = [
        { icon: <Calendar size={18} className="text-green-600" />, label: "DATE", value: "October 24, 2024", bg: "bg-green-50" },
        { icon: <Clock size={18} className="text-yellow-600" />, label: "TIME", value: "09:00 AM - 05:00 PM EST", bg: "bg-yellow-50" },
        { icon: <MapPin size={18} className="text-blue-600" />, label: "VENUE", value: "The Glass Pavilion, NYC", bg: "bg-blue-50" },
        { icon: <User size={18} className="text-purple-600" />, label: "ORGANIZER", value: "Orchestra Creative Labs", bg: "bg-purple-50" },
    ];

    return (
        <UserPageContainer isMobile={isMobile}>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 px-1">
                <span className="cursor-pointer hover:text-slate-600">Events</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">View Details</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                
                {/* Left Side Content */}
                <div className="flex-1 space-y-10">
                    {/* Main Event Image */}
                    <div className="relative rounded-[32px] overflow-hidden shadow-xl aspect-video group">
                        <img 
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" 
                            alt="Event" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8">
                             <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg animate-bounce">
                                Live in 3 days
                             </div>
                        </div>
                    </div>

                    {/* Personal Notes Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-800">
                            <FileText size={20} className="text-[#5CB85C]" />
                            <h3 className="text-lg font-extrabold tracking-tight">Personal Orchestration Notes</h3>
                        </div>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 min-h-[140px]">
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Jot down internal thoughts, speaker requirements, or logistical reminders for this specific event..."
                                className="w-full h-full bg-transparent border-none outline-none text-sm text-slate-400 font-medium italic resize-none"
                            />
                        </div>
                    </div>

                    {/* Inquiries Section */}
                    <div className="bg-[#f3f6f9] rounded-[32px] p-8 md:p-10 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-extrabold text-slate-900">Post-Event Inquiries</h3>
                            <p className="text-slate-500 text-sm font-medium">Reach out to the orchestration team regarding this event.</p>
                        </div>
                        
                        <form onSubmit={handleSendMessage} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Email</label>
                                <input 
                                    type="email" 
                                    defaultValue="orchestrator@eventify.com"
                                    className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#5CB85C]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                <textarea 
                                    placeholder="How can we help you with this event's logistics?"
                                    className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 shadow-sm min-h-[120px] focus:ring-2 focus:ring-[#5CB85C]/20 outline-none transition-all resize-none"
                                />
                            </div>
                            <Button className="w-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-all py-4 font-black uppercase text-xs tracking-widest h-auto shadow-none">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Side Sticky Card */}
                <div className="w-full lg:w-[420px] lg:sticky lg:top-8">
                    <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-50 space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                                Modern Design Orchestration 2024
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                A masterclass in digital orchestration, focusing on the intersection of AI-driven interfaces and editorial design principles. For the visionary creator.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {details.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-5 group">
                                    <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        {item.icon}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-700">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4 text-center">
                            <Button 
                                onClick={() => navigate(`/complete-registration/${id}`)}
                                className="w-full bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-5 rounded-[24px] text-lg font-black shadow-[0_15px_40px_rgba(92,184,92,0.4)] group flex items-center justify-center gap-2 h-auto"
                            >
                                Register Now
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <p className="text-[10px] text-slate-400 font-medium px-8">
                                Secure your spot. Limited availability left for this exclusive event.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </UserPageContainer>
    );
}
