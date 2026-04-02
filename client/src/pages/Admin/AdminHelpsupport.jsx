import React from 'react';
import { Mail, Ticket, ArrowRight, User } from 'lucide-react';

const AdminHelpSupport = () => {
    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Help & Support</h1>
                    <p className="text-slate-500">Browse FAQs or get in touch with our team.</p>
                </div>

                {/* FAQs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-[#ebfaef] flex items-center justify-center shrink-0">
                            <span className="text-red-500 text-2xl font-bold leading-none block pt-1">?</span>
                        </div>
                        <div className="flex flex-col h-full">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-2">How do I register for an event?</h3>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1">
                                Browse events, click Register Now and follow the steps to complete your registration.
                            </p>
                            <a href="#" className="inline-flex items-center text-[#58bd6c] font-semibold text-sm hover:text-[#46a258] transition-colors mt-auto">
                                Learn more <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-[#ebfaef] flex items-center justify-center shrink-0">
                            <span className="text-slate-700 text-xl font-bold leading-none block pb-0.5">×</span>
                        </div>
                        <div className="flex flex-col h-full">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-2">Can I cancel my registration?</h3>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1">
                                Yes, you can cancel up to 48 hours before the event from the My Events section.
                            </p>
                            <a href="#" className="inline-flex items-center text-[#58bd6c] font-semibold text-sm hover:text-[#46a258] transition-colors mt-auto">
                                Learn more <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-[#ebfaef] flex items-center justify-center shrink-0 text-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 fill-slate-200" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <div className="flex flex-col h-full">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-2">How do I contact the organizer?</h3>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1">
                                Use the Post-Event Inquiries form on the event detail page to reach the organizer.
                            </p>
                            <a href="#" className="inline-flex items-center text-[#58bd6c] font-semibold text-sm hover:text-[#46a258] transition-colors mt-auto">
                                Learn more <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-5 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full bg-[#ebfaef] flex items-center justify-center shrink-0 text-[#cbb853]">
                            <Ticket className="w-5 h-5 fill-current opacity-60" />
                        </div>
                        <div className="flex flex-col h-full">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-2">Where can I find my tickets?</h3>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1">
                                Your tickets are emailed after registration and available in the My Events section.
                            </p>
                            <a href="#" className="inline-flex items-center text-[#58bd6c] font-semibold text-sm hover:text-[#46a258] transition-colors mt-auto">
                                Learn more <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-[#1f2937] tracking-tight mb-2">Still need help? Contact Us</h2>
                        <p className="text-[#64748b]">Our support team usually responds within 24 hours.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name Input */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    NAME
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="block w-full pl-10 pr-4 py-[14px] border border-slate-200 bg-[#f8fafc] rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58bd6c]/20 focus:border-[#58bd6c]/50 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    EMAIL
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="block w-full pl-10 pr-4 py-[14px] border border-slate-200 bg-[#f8fafc] rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58bd6c]/20 focus:border-[#58bd6c]/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">
                                MESSAGE
                            </label>
                            <textarea
                                placeholder="How can we help you?"
                                rows={5}
                                className="block w-full px-4 py-[14px] border border-slate-200 bg-[#f8fafc] rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#58bd6c]/20 focus:border-[#58bd6c]/50 transition-colors resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center px-6 py-3 bg-[#5eb670] hover:bg-[#4ea860] text-white font-medium text-sm rounded-lg transition-colors"
                            >
                                Send Message <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminHelpSupport;
