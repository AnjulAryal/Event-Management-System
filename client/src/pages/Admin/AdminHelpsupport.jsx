import React from 'react';
import { Mail, Ticket, ArrowRight, User, HelpCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminHelpSupport = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen">
            <div className="max-w-[1100px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-[#5CB85C]" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Help & Support</h1>
                        </div>
                        <p className="text-slate-500 text-lg font-medium">Browse FAQs or get in touch with our team.</p>
                    </div>
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/admin-dashboard')}
                        icon={ChevronLeft}
                        className="w-fit"
                    >
                        Back to Dashboard
                    </Button>
                </div>

                {/* FAQs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {[
                        { q: "How do I register for an event?", a: "Browse events, click Register Now and follow the steps to complete your registration.", icon: "?" },
                        { q: "Can I cancel my registration?", a: "Yes, you can cancel up to 48 hours before the event from the My Events section.", icon: "×" },
                        { q: "How do I contact the organizer?", a: "Use the Post-Event Inquiries form on the event detail page to reach the organizer.", icon: <Mail size={20} /> },
                        { q: "Where can I find my tickets?", a: "Your tickets are emailed after registration and available in the My Events section.", icon: <Ticket size={20} /> }
                    ].map((faq, i) => (
                        <div key={i} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex gap-6 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-green-50 transition-colors">
                                <span className="text-[#5CB85C] text-xl font-bold">{faq.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                    {faq.a}
                                </p>
                                <a href="#" className="inline-flex items-center text-[#5CB85C] font-bold text-sm hover:translate-x-1 transition-transform">
                                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-50">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Still need help? Contact Us</h2>
                        <p className="text-slate-500 text-lg font-medium">Our support team usually responds within 24 hours.</p>
                    </div>

                    <form className="max-w-3xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input 
                                label="Name"
                                placeholder="Your name"
                                icon={User}
                                fullWidth
                            />
                            <Input 
                                label="Email"
                                type="email"
                                placeholder="your@email.com"
                                icon={Mail}
                                fullWidth
                            />
                        </div>

                        <Input 
                            label="Message"
                            placeholder="How can we help you?"
                            multiline
                            rows={6}
                            fullWidth
                        />

                        <div className="flex justify-center pt-4">
                            <Button className="px-12 py-4 text-base" icon={ArrowRight} iconPosition="right">
                                Send Message
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminHelpSupport;

