import { useState, useEffect } from "react";
import { Mail, Calendar, Star, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserFeedback() {
    const [rating, setRating] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [formData, setFormData] = useState({
        eventTitle: "",
        email: "",
        date: "",
        message: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const inputStyle = (hasError) => ({
        width: "100%",
        padding: "14px 16px",
        borderRadius: 10,
        border: hasError ? "1.5px solid #ef4444" : "1.5px solid #f3f4f6",
        background: "#F8FAFB",
        fontSize: 14,
        color: "#333",
        outline: "none",
        fontFamily: "inherit",
        transition: "all 0.2s",
    });

    const labelStyle = {
        fontSize: "10px",
        fontWeight: 800,
        color: "#5CB85C",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "8px",
        display: "block",
    };

    const errorStyle = {
        fontSize: "11px",
        color: "#ef4444",
        marginTop: "5px",
        fontWeight: "600",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.eventTitle.trim()) newErrors.eventTitle = "Event title is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.date) newErrors.date = "Event date is required";
        if (!formData.message.trim()) newErrors.message = "Feedback message cannot be empty";
        if (rating === 0) newErrors.rating = "Please select a rating";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validate()) {
            toast.error("Please fix the errors in the form", {
                style: { background: "#1A1A1A", color: "#fff", borderRadius: "10px" }
            });
            return;
        }

        toast.success("Feedback sent successfully!", {
            duration: 3000,
            style: {
                background: "#1A1A1A",
                color: "#fff",
                borderRadius: "10px",
                fontWeight: "600",
            }
        });

        // Reset form
        setFormData({ eventTitle: "", email: "", date: "", message: "" });
        setRating(0);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#eef0ec", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 28px" }} className="animate-in fade-in duration-700">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-[32px] font-black text-[#1A1A1A] tracking-tight">Submit Feedback</h1>
                    <p className="text-gray-400 text-[15px] mt-1 font-medium">Share your event experience with the team.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-[700px]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Event Title */}
                        <div>
                            <label style={labelStyle}>Event Title</label>
                            <input 
                                type="text" 
                                name="eventTitle"
                                value={formData.eventTitle}
                                onChange={handleChange}
                                placeholder="e.g. Global Tech Summit 2024"
                                style={inputStyle(errors.eventTitle)}
                                className="focus:border-[#5CB85C]/30"
                            />
                            {errors.eventTitle && <div style={errorStyle}>{errors.eventTitle}</div>}
                        </div>

                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email</label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-300' : 'text-gray-300'}`} />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    style={{ ...inputStyle(errors.email), paddingLeft: 44 }}
                                    className="focus:border-[#5CB85C]/30"
                                />
                            </div>
                            {errors.email && <div style={errorStyle}>{errors.email}</div>}
                        </div>

                        {/* Date */}
                        <div>
                            <label style={labelStyle}>Date</label>
                            <div className="relative">
                                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.date ? 'text-red-300' : 'text-gray-300'}`} />
                                <input 
                                    type="date" 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    style={{ ...inputStyle(errors.date), paddingLeft: 44 }}
                                    className="focus:border-[#5CB85C]/30 cursor-pointer"
                                />
                            </div>
                            {errors.date && <div style={errorStyle}>{errors.date}</div>}
                        </div>

                        {/* Feedback Message */}
                        <div>
                            <label style={labelStyle}>Feedback Message</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Share your experience about this event..."
                                rows={6}
                                style={{ ...inputStyle(errors.message), resize: "none" }}
                                className="focus:border-[#5CB85C]/30"
                            ></textarea>
                            {errors.message && <div style={errorStyle}>{errors.message}</div>}
                        </div>

                        {/* Rating */}
                        <div>
                            <label style={labelStyle}>Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star}
                                        size={24}
                                        className={`cursor-pointer transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                        onClick={() => {
                                            setRating(star);
                                            if (errors.rating) setErrors(prev => ({ ...prev, rating: "" }));
                                        }}
                                    />
                                ))}
                            </div>
                            {errors.rating && <div style={errorStyle}>{errors.rating}</div>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                className="w-full bg-[#5CB85C] hover:bg-[#4AA14A] text-white font-bold py-4 rounded-[12px] text-[15px] flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-[0_8px_20px_rgba(92,184,92,0.25)]"
                                type="submit"
                            >
                                Send Feedback <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
