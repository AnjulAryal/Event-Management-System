import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";

export default function AdminHelpSupport() {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupportRequests = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user?.token;

                const res = await fetch('/api/support', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch support requests');
                const data = await res.json();
                setSupportRequests(data);
            } catch (error) {
                console.error("Error fetching support requests:", error);
                toast.error("Failed to load requests");
            } finally {
                setLoading(false);
            }
        };

        fetchSupportRequests();
    }, []);

    const handleReply = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Are you sure you want to remove this support ticket?")) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const res = await fetch(`/api/support/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to delete request');
            
            setSupportRequests(prev => prev.filter(req => req._id !== id));
            toast.success("Ticket removed successfully");
        } catch (error) {
            console.error("Error deleting support request:", error);
            toast.error("Failed to remove ticket");
        }
    };

    return (
        <div className="flex-1 w-full min-h-screen bg-[#F5F7FA] p-6 sm:p-8 md:p-12 lg:p-16 font-sans">
            <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500">
                <div className="mb-8 md:mb-10">
                    <h1 className="text-[28px] md:text-3xl lg:text-[32px] font-bold text-[#1e293b] mb-2 tracking-tight">Help & Support</h1>
                    <p className="text-[#64748b] text-sm md:text-base font-medium">Browse FAQs or get in touch with our team.</p>
                </div>

                {/* Cards Section */}
                {loading ? (
                    <div className="py-8 text-center text-[#64748b] animate-pulse font-medium">Loading support requests...</div>
                ) : supportRequests.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                        {supportRequests.map((card, idx) => (
                            <div key={card._id || idx} className="bg-white rounded-[16px] p-5 sm:p-6 md:p-7 flex flex-col sm:flex-row gap-5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300">
                                
                                {/* Left icon */}
                                <div className="w-[52px] h-[52px] rounded-full bg-[#dcfce7] flex-shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                                    {/* Light green blank circle matching image */}
                                </div>
                                
                                {/* Right content */}
                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-[#1e293b] text-[16px] font-bold mb-2.5 text-center sm:text-left break-all tracking-tight">{card.email}</h3>
                                    <p className="text-[#8898aa] text-[13px] leading-relaxed mb-6 text-center sm:text-left font-medium">{card.message}</p>
                                    
                                    {/* Action Buttons align to right */}
                                    <div className="mt-auto flex gap-3.5 justify-center sm:justify-end">
                                        <button 
                                            onClick={() => handleReply(card.email)}
                                            className="bg-[#5cb85c] hover:bg-[#4cae4c] active:scale-95 text-white text-[13px] font-bold py-1.5 px-6 md:px-8 rounded-full transition-all shadow-sm"
                                        >
                                            Reply
                                        </button>
                                        <button 
                                            onClick={() => handleRemove(card._id)}
                                            className="bg-[#5cb85c] hover:bg-[#4cae4c] active:scale-95 text-white text-[13px] font-bold py-1.5 px-6 md:px-8 rounded-full transition-all shadow-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center text-[#64748b] bg-white rounded-[20px] border border-dashed border-slate-200">
                        No support requests found.
                    </div>
                )}
            </div>
        </div>
    );
}
