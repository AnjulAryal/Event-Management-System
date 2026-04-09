import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Upload, ArrowRight, CreditCard, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import UserPageContainer from "../../components/user/UserPageContainer";
import Button from "../../components/ui/Button";

export default function CompleteRegistration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedPayment, setSelectedPayment] = useState("esewa");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        toast.success("Registration completed successfully!");
        setTimeout(() => navigate("/user-events"), 1500);
    };

    const paymentMethods = [
        { id: "imepay", name: "IME PAY", icon: <CreditCard size={20} /> },
        { id: "esewa", name: "ESEWA", icon: <div className="font-black text-xs uppercase">e</div> },
        { id: "fonepay", name: "FONEPAY", icon: <div className="font-black text-xs uppercase">f</div> },
        { id: "khalti", name: "KHALTI", icon: <div className="font-black text-xs uppercase">k</div> },
    ];

    return (
        <UserPageContainer isMobile={isMobile}>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 px-1">
                <span className="cursor-pointer hover:text-slate-600">Events</span>
                <ChevronRight size={14} />
                <span className="cursor-pointer hover:text-slate-600">Register</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">Complete Registration</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Section: Event Summary Card */}
                <div className="w-full lg:w-[380px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 flex-shrink-0">
                    <div className="relative h-64 bg-slate-900 flex items-center justify-center overflow-hidden">
                        {/* 3D Cube Graphic Mockup */}
                        <div className="w-32 h-32 relative animate-pulse">
                             <div className="absolute inset-0 bg-blue-500/20 rotate-45 transform scale-75 border-2 border-blue-400/30 rounded-lg"></div>
                             <div className="absolute inset-0 bg-blue-400/40 -rotate-12 transform border-2 border-white/20 rounded-lg flex items-center justify-center">
                                 <div className="w-8 h-8 rounded-full bg-[#5CB85C] blur-md shadow-[0_0_20px_#5CB85C]"></div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">
                               Global Innovators Summit 2024
                           </h2>
                           <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-2 text-sm font-medium text-slate-500">
                                    <MapPin size={16} className="text-[#5CB85C] mt-0.5" />
                                    <span>Kathmandu Convention Center, Nepal</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm font-medium text-slate-500">
                                    <Calendar size={16} className="text-[#5CB85C] mt-0.5" />
                                    <span>Friday, Oct 25 • 09:00 AM</span>
                                </div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span>1x Ticket</span>
                                <span className="text-slate-800">Rs. 1,500.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span>Service fee</span>
                                <span className="text-slate-800">Rs. 45.00</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total</span>
                            <span className="text-2xl font-black text-[#5CB85C] tracking-tight">Rs. 1,545.00</span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form Card */}
                <div className="flex-1 bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-50">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">Complete Registration</h1>
                    
                    <form onSubmit={handleRegister} className="space-y-10">
                        {/* Name and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <input type="text" placeholder="Your Name" className="w-full bg-[#f3f6f9] border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#5CB85C]/20 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone No.</label>
                                <input type="text" placeholder="+977-XXXXXXXXXX" className="w-full bg-[#f3f6f9] border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#5CB85C]/20 transition-all outline-none" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <input type="email" defaultValue="john@example.com" className="w-full bg-[#f3f6f9] border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#5CB85C]/20 transition-all outline-none" />
                        </div>

                        {/* Tickets Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">No. of Tickets</label>
                            <select className="w-full bg-[#f3f6f9] border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#5CB85C]/20 transition-all outline-none appearance-none cursor-pointer">
                                <option>1 Ticket</option>
                                <option>2 Tickets</option>
                                <option>5 Tickets</option>
                            </select>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Proof of Id</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center group hover:border-[#5CB85C]/50 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#5CB85C]/10 group-hover:text-[#5CB85C] transition-all">
                                    <Upload size={20} />
                                </div>
                                <p className="text-slate-400 text-sm font-bold">Drag and drop files here</p>
                                <p className="text-[#5CB85C] text-xs font-black mt-1 uppercase tracking-tighter">Click to upload proof</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Method</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {paymentMethods.map(pm => (
                                    <div 
                                        key={pm.id}
                                        onClick={() => setSelectedPayment(pm.id)}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                            selectedPayment === pm.id 
                                            ? 'border-[#5CB85C] bg-[#5CB85C]/5' 
                                            : 'border-slate-50 bg-slate-50/50 grayscale hover:grayscale-0 hover:bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPayment === pm.id ? 'bg-[#5CB85C] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {pm.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-800">{pm.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                             <Button 
                                type="submit"
                                className="bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-4 px-12 rounded-full text-lg font-black shadow-[0_10px_30px_rgba(92,184,92,0.3)] group h-auto"
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
