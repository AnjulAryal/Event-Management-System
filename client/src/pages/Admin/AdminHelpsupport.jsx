import React, { useState, useEffect } from 'react';
import { User, Mail, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminHelpSupport() {
    const [supportRequests, setSupportRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

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
            } finally {
                setLoading(false);
            }
        };

        fetchSupportRequests();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error("Please fill all fields");
            return;
        }

        const subject = encodeURIComponent(`Support Request from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:support@eventify.com?subject=${subject}&body=${body}`;


        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to send message');
            
            const newRequest = await res.json();
            setSupportRequests(prev => [newRequest, ...prev]);

            toast.success("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="flex-1 w-full min-h-screen bg-[#f3f4f6] p-6 sm:p-8 md:p-12 lg:p-16 font-sans">
            <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500">
                <div className="mb-8 md:mb-10">
                    <h1 className="text-[28px] md:text-3xl lg:text-[32px] font-bold text-[#1e293b] mb-2 tracking-tight">Help & Support</h1>
                    <p className="text-[#64748b] text-sm md:text-base font-medium">Browse FAQs or get in touch with our team.</p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    {loading ? (
                        <div className="col-span-full py-8 text-center text-[#64748b] animate-pulse font-medium">Loading support requests...</div>
                    ) : supportRequests.length > 0 ? (
                        supportRequests.map((card, idx) => (
                            <div key={card._id || idx} className="bg-white rounded-[20px] p-6 sm:p-8 flex gap-4 sm:gap-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e6f4ea] flex-shrink-0 flex items-center justify-center">
                                    <User size={20} className="text-[#5cb85c]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[#1e293b] text-[15px] font-bold mb-1">{card.name}</h3>
                                    <a href={`mailto:${card.email}`} className="text-[#5cb85c] text-[13px] font-semibold mb-2 hover:underline inline-block">{card.email}</a>
                                    <p className="text-[#64748b] text-[13px] md:text-[14px] leading-relaxed">{card.message}</p>
                                    {card.status && (
                                        <div className="mt-3 inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-md">
                                            {card.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-[#64748b] bg-white rounded-[20px] border border-dashed border-gray-200">
                            No support requests found.
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-[20px] lg:text-[22px] font-bold text-[#1e293b] mb-1">Still need help? Contact Us</h2>
                    <p className="text-[#64748b] text-[14px] mb-8 font-medium">Our support team usually responds within 24 hours.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={16} className="text-[#94a3b8]" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="w-full pl-11 pr-4 py-3.5 bg-[#f8fafc] border border-transparent focus:border-[#5cb85c]/30 focus:bg-white rounded-xl text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-4 focus:ring-[#5cb85c]/10 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={16} className="text-[#94a3b8]" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-[#f8fafc] border border-transparent focus:border-[#5cb85c]/30 focus:bg-white rounded-xl text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-4 focus:ring-[#5cb85c]/10 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help you?"
                                rows={5}
                                className="w-full px-4 py-3.5 bg-[#f8fafc] border border-transparent focus:border-[#5cb85c]/30 focus:bg-white rounded-xl text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-4 focus:ring-[#5cb85c]/10 transition-all resize-none font-medium"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-[14px] rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-fit"
                            >
                                Send Message <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
