import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, ChevronRight, User, Phone, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import UserPageContainer from "../../components/user/UserPageContainer";
import Button from "../../components/ui/Button";

export default function CompleteRegistration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${id}`);
                const data = await res.json();
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        const token = user?.token;

        if (!user || !token) {
            toast.error("Please login to register");
            return;
        }

        const loadingToast = toast.loading("Processing registration...");

        try {
            const res = await fetch(`/api/events/${id}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user._id })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Registration successful!", { id: loadingToast });
                setTimeout(() => navigate("/user-events"), 1500);
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.message || "Failed to register", { id: loadingToast });
        }
    };

    return (
        <UserPageContainer isMobile={isMobile}>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-10 px-1 uppercase tracking-widest">
                <span className="cursor-pointer hover:text-slate-600 transition-colors" onClick={() => navigate("/")}>Events</span>
                <ChevronRight size={10} />
                <span className="cursor-pointer hover:text-slate-600 transition-colors">Register</span>
                <ChevronRight size={10} />
                <span className="text-slate-900">Complete Registration</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 items-start max-w-6xl mx-auto">
                
                {/* Left Section: Event Summary Card */}
                <div className="w-full lg:w-[400px] bg-white rounded-[40px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex-shrink-0 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                    <div className="relative h-72 bg-[#0f172a] flex items-center justify-center overflow-hidden">
                        {loading ? (
                            <div className="animate-pulse w-full h-full bg-slate-200"></div>
                        ) : (
                            <>
                                {event?.coverImage ? (
                                    <img src={event.coverImage} className="w-full h-full object-cover opacity-80" alt={event.title} />
                                ) : (
                                    <div className="w-40 h-40 relative">
                                        <div className="absolute inset-0 bg-blue-500/10 rotate-45 transform scale-90 border-2 border-blue-400/20 rounded-2xl"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/30 -rotate-6 transform border-2 border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-10 h-10 rounded-full bg-[#5CB85C] blur-lg opacity-40"></div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    <div className="p-10 space-y-8">
                        {!loading && (
                            <div className="space-y-4">
                               <h2 className="text-2xl font-black text-slate-900 leading-[1.2] tracking-tight">
                                   {event?.title}
                               </h2>
                               <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <MapPin size={16} className="text-red-500" />
                                        </div>
                                        <span className="truncate">{event?.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Calendar size={16} className="text-blue-500" />
                                        </div>
                                        <span>{event?.date} {event?.time && `• ${event.time}`}</span>
                                    </div>
                               </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-slate-100 flex justify-between items-center group">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Type</span>
                            <span className="text-sm font-black text-[#5CB85C] group-hover:scale-105 transition-transform">Standard Ticket</span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form Card */}
                <div className="flex-1 w-full bg-white rounded-[40px] p-10 md:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 tracking-tight">Complete Registration</h1>
                    
                    <form onSubmit={handleRegister} className="space-y-10">
                        {/* Name and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <input type="text" placeholder="John Doe" className="w-full bg-[#f8fafc] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none" required />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone No.</label>
                                <div className="relative group">
                                    <input type="text" placeholder="+977-XXXXXXXXXX" className="w-full bg-[#f8fafc] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none" required />
                                </div>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <input type="email" placeholder="john@example.com" className="w-full bg-[#f8fafc] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none" required />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                             <Button 
                                type="submit"
                                className="bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-5 px-14 rounded-full text-lg font-black shadow-[0_15px_35px_rgba(92,184,92,0.3)] hover:shadow-[0_20px_45px_rgba(92,184,92,0.4)] transition-all active:scale-[0.96] h-auto group"
                                icon={ArrowRight}
                                iconPosition="right"
                             >
                                Register
                             </Button>
                        </div>
                    </form>
                </div>
            </div>
        </UserPageContainer>
    );
}
