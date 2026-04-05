import { useState, useEffect } from "react";
import { Mail, Calendar, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Rating from "../../components/ui/Rating";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            toast.error("Please fix the errors in the form");
            return;
        }

        toast.success("Feedback sent successfully!");
        setFormData({ eventTitle: "", email: "", date: "", message: "" });
        setRating(0);
    };

    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans">
            <div className={`max-w-[1100px] mx-auto px-4 md:px-7 ${isMobile ? 'py-6' : 'py-10'} animate-in fade-in duration-700`}>
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Submit Feedback</h1>
                    <p className="text-slate-500 text-lg mt-1 font-medium">Share your event experience with the team.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-50 max-w-2xl">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        
                        <div className="space-y-6">
                            {/* Event Title */}
                            <Input 
                                label="Event Title"
                                name="eventTitle"
                                value={formData.eventTitle}
                                onChange={handleChange}
                                placeholder="e.g. Global Tech Summit 2024"
                                error={errors.eventTitle}
                            />

                            {/* Email */}
                            <Input 
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                icon={Mail}
                                error={errors.email}
                            />

                            {/* Date */}
                            <Input 
                                label="Date"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                icon={Calendar}
                                error={errors.date}
                            />

                            {/* Feedback Message */}
                            <Input 
                                label="Feedback Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Share your experience about this event..."
                                multiline
                                error={errors.message}
                            />

                            {/* Rating */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1">Overall Rating</label>
                                <Rating 
                                    value={rating} 
                                    onChange={(val) => {
                                      setRating(val);
                                      if (errors.rating) setErrors(prev => ({ ...prev, rating: "" }));
                                    }}
                                    error={!!errors.rating}
                                />
                                {errors.rating && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.rating}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button 
                            type="submit"
                            fullWidth
                            className="py-4 text-base"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Send Feedback
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

