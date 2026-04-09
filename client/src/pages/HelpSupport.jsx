import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HelpCircle, XCircle, Info, Ticket, User, Mail, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import HelpFAQCard from "../components/help/HelpFAQCard";

const FAQ_CARDS = [
    {
        icon: <HelpCircle className="text-red-500" size={20} />,
        iconBg: "#fef2f2",
        title: "How do I register for an event?",
        description: "Browse events, click Register Now and follow the steps to complete your registration.",
        link: "/help/registration"
    },
    {
        icon: <XCircle className="text-green-600" size={20} />,
        iconBg: "#f0fdf4",
        title: "Can I cancel my registration?",
        description: "Yes, you can cancel up to 48 hours before the event from the My Events section.",
        link: "/help/cancellation"
    },
    {
        icon: <Info className="text-blue-500" size={20} />,
        iconBg: "#eff6ff",
        title: "How do I contact the organizer?",
        description: "Use the Post-Event Inquiries form on the event detail page to reach the organizer.",
        link: "/help/organizer"
    },
    {
        icon: <Ticket className="text-yellow-600" size={20} />,
        iconBg: "#fefce8",
        title: "Where can I find my tickets?",
        description: "Your tickets are emailed after registration and available in the My Events section.",
        link: "/help/tickets"
    }
];

export default function HelpSupport() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
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
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-[#eef0ec] font-sans">
            <div className={`max-w-[1100px] mx-auto px-4 md:px-7 ${isMobile ? 'py-6' : 'py-10'} animate-in fade-in duration-700`}>
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">Help & Support</h1>
                    <p className="text-slate-500 text-lg mt-1 font-medium">Browse FAQs or get in touch with our team.</p>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {FAQ_CARDS.map((card, idx) => (
                        <HelpFAQCard key={idx} card={card} />
                    ))}
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-50">
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Still need help? Contact Us</h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium">Our support team usually responds within 24 hours.</p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input 
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                icon={User}
                                error={errors.name}
                            />
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
                        </div>

                        <Input 
                            label="Message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            multiline
                            error={errors.message}
                        />

                        <Button 
                            type="submit"
                            className="self-start py-4"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

