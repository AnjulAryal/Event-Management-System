import { useState, useEffect } from "react";
import { Mail, User, MessageSquare, ArrowRight, HelpCircle, XCircle, Info, Ticket } from "lucide-react";
import { toast } from "react-hot-toast";

const FAQ_CARDS = [
    {
        icon: <HelpCircle className="text-red-500" size={20} />,
        iconBg: "#fef2f2",
        title: "How do I register for an event?",
        description: "Browse events, click Register Now and follow the steps to complete your registration.",
    },
    {
        icon: <XCircle className="text-green-600" size={20} />,
        iconBg: "#f0fdf4",
        title: "Can I cancel my registration?",
        description: "Yes, you can cancel up to 48 hours before the event from the My Events section.",
    },
    {
        icon: <Info className="text-blue-500" size={20} />,
        iconBg: "#eff6ff",
        title: "How do I contact the organizer?",
        description: "Use the Post-Event Inquiries form on the event detail page to reach the organizer.",
    },
    {
        icon: <Ticket className="text-yellow-600" size={20} />,
        iconBg: "#fefce8",
        title: "Where can I find my tickets?",
        description: "Your tickets are emailed after registration and available in the My Events section.",
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
            toast.error("Please fill all required fields correctly", {
                style: { background: "#1A1A1A", color: "#fff", borderRadius: "10px" }
            });
            return;
        }

        toast.success("Message sent successfully!", {
            style: { background: "#1A1A1A", color: "#fff", borderRadius: "10px" }
        });
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div style={{ minHeight: "100vh", background: "#eef0ec", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 28px" }} className="animate-in fade-in duration-700">
                
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#1A202C", margin: 0 }}>Help & Support</h1>
                    <p style={{ color: "#718096", fontSize: "15px", marginTop: "4px" }}>Browse FAQs or get in touch with our team.</p>
                </div>

                {/* FAQ Grid */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
                    gap: "24px",
                    marginBottom: "48px"
                }}>
                    {FAQ_CARDS.map((card, idx) => (
                        <div key={idx} style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "24px",
                            display: "flex",
                            gap: "16px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                            border: "1px solid #f0f0f0"
                        }}>
                            <div style={{ 
                                width: "48px", height: "48px", borderRadius: "50%", 
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: card.iconBg, flexShrink: 0
                            }}>
                                {card.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1A202C", marginBottom: "8px" }}>{card.title}</h3>
                                <p style={{ fontSize: "14px", color: "#718096", lineHeight: "1.5", marginBottom: "16px" }}>{card.description}</p>
                                <a href="#" style={{ 
                                    fontSize: "13px", fontWeight: 700, color: "#5CB85C", 
                                    textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" 
                                }}>
                                    Learn more <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Section */}
                <div style={{ 
                    background: "#fff", 
                    borderRadius: "24px", 
                    padding: isMobile ? "24px" : "40px",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.04)"
                }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1A202C", marginBottom: "8px" }}>Still need help? Contact Us</h2>
                    <p style={{ color: "#718096", fontSize: "14px", marginBottom: "32px" }}>Our support team usually responds within 24 hours.</p>
                    
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>
                            {/* Name */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "10px", fontWeight: 800, color: "#A0AEC0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</label>
                                <div style={{ position: "relative" }}>
                                    <User size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#A0AEC0" }} />
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        style={{ 
                                            width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px", 
                                            background: "#F7FAFC", border: errors.name ? "1.5px solid #ef4444" : "1.5px solid #f3f4f6",
                                            fontSize: "14px", outline: "none", transition: "all 0.2s"
                                        }}
                                    />
                                </div>
                                {errors.name && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600 }}>{errors.name}</span>}
                            </div>

                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "10px", fontWeight: 800, color: "#A0AEC0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                                <div style={{ position: "relative" }}>
                                    <Mail size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#A0AEC0" }} />
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        style={{ 
                                            width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px", 
                                            background: "#F7FAFC", border: errors.email ? "1.5px solid #ef4444" : "1.5px solid #f3f4f6",
                                            fontSize: "14px", outline: "none", transition: "all 0.2s"
                                        }}
                                    />
                                </div>
                                {errors.email && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600 }}>{errors.email}</span>}
                            </div>
                        </div>

                        {/* Message */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontSize: "10px", fontWeight: 800, color: "#A0AEC0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Message</label>
                            <div style={{ position: "relative" }}>
                                <textarea 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    rows={6}
                                    style={{ 
                                        width: "100%", padding: "16px", borderRadius: "12px", 
                                        background: "#F7FAFC", border: errors.message ? "1.5px solid #ef4444" : "1.5px solid #f3f4f6",
                                        fontSize: "14px", outline: "none", resize: "none", transition: "all 0.2s"
                                    }}
                                />
                            </div>
                            {errors.message && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600 }}>{errors.message}</span>}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            style={{
                                alignSelf: "flex-start",
                                padding: "14px 32px",
                                borderRadius: "12px",
                                background: "#5CB85C",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "15px",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.2s",
                                boxShadow: "0 4px 14px rgba(92,184,92,0.3)"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#4AA14A"}
                            onMouseLeave={e => e.currentTarget.style.background = "#5CB85C"}
                        >
                            Send Message <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
