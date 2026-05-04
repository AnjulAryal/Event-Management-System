import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, ChevronRight, User, Phone, Mail, ChevronDown, Wallet, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";
import UserPageContainer from "../../components/user/UserPageContainer";
import Button from "../../components/ui/Button";

export default function CompleteRegistration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [ticketCount, setTicketCount] = useState(1);

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

    const generateSignature = async (total_amount, transaction_uuid, product_code) => {
        const secretKey = "8gBm/:&EnhH.1/q";
        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(message);

        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        return btoa(String.fromCharCode.apply(null, signatureArray));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        const token = user?.token;

        if (!user || !token) {
            toast.error("Please login to register");
            return;
        }

        if (event && !event.isFree) {
            // eSewa Payment Flow
            try {
                // Initialize payment securely in the database
                const initiateRes = await fetch(`/api/events/${id}/initiate-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        registrationDetails: { name, phone, email, ticketCount }
                    })
                });
                
                const initiateData = await initiateRes.json();
                
                if (!initiateRes.ok) {
                    toast.error(initiateData.message || "Failed to initiate payment");
                    return;
                }

                const amount = initiateData.amount;
                const tax_amount = 45; // Service fee
                const total_amount = amount + tax_amount;
                const transaction_uuid = initiateData.transaction_uuid;
                const product_code = "EPAYTEST";

                const signature = await generateSignature(total_amount, transaction_uuid, product_code);

                // eSewa can be tricky with separated fees. To guarantee the correct price is charged,
                // we bundle the total amount into the main 'amount' field and set fees to 0.
                const formData = {
                    amount: total_amount,
                    failure_url: `${window.location.origin}/events/${id}/register`,
                    product_delivery_charge: "0",
                    product_service_charge: "0",
                    product_code: product_code,
                    signature: signature,
                    signed_field_names: "total_amount,transaction_uuid,product_code",
                    success_url: `${window.location.origin}/payment-success`,
                    tax_amount: "0",
                    total_amount: total_amount,
                    transaction_uuid: transaction_uuid
                };

                const form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

                for (const key in formData) {
                    const hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", formData[key]);
                    form.appendChild(hiddenField);
                }

                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                console.error("Payment initiation error:", error);
                toast.error("Failed to initiate payment");
            }
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
                body: JSON.stringify({ 
                    userId: user._id,
                    registrationDetails: { name, phone, email, ticketCount }
                })
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

                        <div className="pt-8 border-t border-slate-100 flex justify-between items-center group hidden">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Type</span>
                            <span className="text-sm font-black text-[#5CB85C] group-hover:scale-105 transition-transform">
                                {event?.isFree ? "Free Entry" : `Standard Ticket (Rs. ${event?.ticketPrice})`}
                            </span>
                        </div>
                        
                        {!event?.isFree && (
                            <div className="space-y-3 pt-6 border-t border-slate-100 text-[13px] font-medium text-slate-500">
                                <div className="flex justify-between items-center">
                                    <span>{ticketCount}x Ticket</span>
                                    <span className="font-bold text-slate-900">Rs. {(event?.ticketPrice * ticketCount)?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Service fee</span>
                                    <span className="font-bold text-slate-900">Rs. 45.00</span>
                                </div>
                                <div className="pt-4 flex justify-between items-center text-lg">
                                    <span className="font-black text-slate-900">Total</span>
                                    <span className="font-black text-[#5CB85C]">
                                        Rs. {((event?.ticketPrice * ticketCount) + 45).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Form Card */}
                <div className="flex-1 w-full bg-white rounded-[40px] p-10 md:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 tracking-tight">Complete Registration</h1>
                    
                    <form onSubmit={handleRegister} className="space-y-8">
                        {/* Name and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none" 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Phone No.</label>
                                <input 
                                    type="text" 
                                    placeholder="977+" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="john@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none" 
                                required 
                            />
                        </div>

                        {/* No. of Tickets */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">No. of Tickets</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-[#f3f4f6] border border-transparent rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:bg-white focus:border-[#5CB85C]/30 transition-all outline-none appearance-none cursor-pointer"
                                    value={ticketCount}
                                    onChange={(e) => setTicketCount(parseInt(e.target.value))}
                                >
                                    <option value={1}>1 Ticket</option>
                                    <option value={2}>2 Tickets</option>
                                    <option value={3}>3 Tickets</option>
                                    <option value={4}>4 Tickets</option>
                                    <option value={5}>5 Tickets</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Proof of Id */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-900 ml-1">Proof of Id</label>
                            <label className="block w-full border border-dashed border-[#d1d5db] rounded-2xl py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                <input type="file" className="hidden" />
                                <UploadCloud className="w-8 h-8 mb-2 text-[#5CB85C]" strokeWidth={2} />
                                <span className="text-[13px] text-slate-500 mb-1">Drag and drop files here</span>
                                <span className="text-[11px] text-[#5CB85C] font-medium">Click to upload proof</span>
                            </label>
                        </div>

                        {/* Payment Method Section (Only for paid events) */}
                        {!loading && !event?.isFree && (
                            <div className="space-y-2 pt-2">
                                <label className="text-[11px] font-bold text-slate-900 ml-1">Payment Method</label>
                                <div className="flex gap-4">
                                    <div className="border border-[#5CB85C] bg-[#f3f4f6] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer w-[100px] h-[70px] gap-1.5 shadow-sm">
                                        <Wallet className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                                        <span className="text-[9px] font-black tracking-wider text-slate-900">ESEWA</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                             <Button 
                                type="submit"
                                className="bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-3.5 px-8 rounded-[14px] text-[15px] font-medium transition-all active:scale-[0.98] group flex items-center gap-2"
                             >
                                Register <ArrowRight className="w-4 h-4" />
                             </Button>
                        </div>
                    </form>
                </div>
            </div>
        </UserPageContainer>
    );
}
