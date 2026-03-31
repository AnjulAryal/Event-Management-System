import React from 'react';
import { Search, MapPin, CalendarDays, Edit2, Trash2, ArrowRight } from 'lucide-react';

const AdminSpeakers = () => {
    // Generate speaker data
    const speakers = [
        { initials: "SC", name: "Sarah Chen", role: "UX Director, Google", tag: "UI/UX Design" },
        { initials: "MR", name: "Marcus Rodriguez", role: "CTO, TechForward", tag: "Technology" },
        { initials: "AP", name: "Aisha Patel", role: "CEO, DesignCo", tag: "Business" },
        { initials: "JL", name: "James Liu", role: "Product Lead, Meta", tag: "UI/UX Design" },
        { initials: "EW", name: "Emma Wilson", role: "Sustainability Expert", tag: "Business" },
        { initials: "DK", name: "David Kim", role: "AI Researcher, OpenAI", tag: "Technology" }
    ];

    return (
        <div className="min-h-screen bg-[#F7F9FB] font-sans text-slate-800 flex flex-col pb-12">

            {/* Top Navigation Wrapper */}
            <div className="pt-6 px-6 lg:px-10 max-w-[1300px] mx-auto w-full">
                {/* Search Bar */}
                <div className="relative w-full max-w-xl mb-12">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search events..." // from the screenshot
                        className="w-full bg-white border border-slate-100 text-[14px] rounded-full py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-600 transition"
                    />
                </div>

                {/* Main Content Area */}
                <main>
                    <div className="mb-8">
                        <h1 className="text-[34px] font-extrabold text-slate-900 mb-1.5 tracking-tight">Speakers</h1>
                        <p className="text-slate-500 font-medium text-[15px]">Meet our world-class speakers</p>
                    </div>

                    {/* Speakers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {speakers.map((speaker, index) => (
                            <div key={index} className="bg-white rounded-[20px] shadow-sm p-6 flex flex-col border border-slate-100/60 hover:shadow-md transition duration-200">

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex gap-4">
                                        {/* Avatar */}
                                        <div className="w-[52px] h-[52px] rounded-full bg-[#6cc371] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm tracking-wide">
                                            {speaker.initials}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col pt-0.5">
                                            <h3 className="font-bold text-slate-900 text-[16px] leading-tight mb-1">{speaker.name}</h3>
                                            <p className="text-slate-400 text-[13px] font-medium mb-2.5">{speaker.role}</p>
                                            <span className="inline-flex w-fit items-center px-3 py-1 bg-[#eefaef] text-[#5cb960] text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                {speaker.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edit/Delete Icons */}
                                    <div className="flex gap-3 text-slate-600">
                                        <button className="hover:text-slate-900 transition">
                                            <Edit2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                        </button>
                                        <button className="hover:text-red-500 transition">
                                            <Trash2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-slate-100 mb-4" />

                                {/* Event Details */}
                                <div className="space-y-2 mb-6 flex-1">
                                    <div className="flex items-center text-slate-500 text-[12.5px] font-medium">
                                        <MapPin className="w-3.5 h-3.5 mr-2 text-red-500 shrink-0" />
                                        <span>Speaking at Design Summit 2024</span>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-[12.5px] font-medium">
                                        <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                                        <span>Dec 01 - 02, 2024</span>
                                    </div>
                                </div>

                                {/* View Profile Button */}
                                <button className="w-full flex justify-center items-center gap-1.5 bg-[#eefaef] hover:bg-[#d6f0d9] text-[#5cb960] font-bold text-[13px] py-2.5 rounded-[10px] transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-green-50/50">
                                    View Profile
                                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                                </button>

                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSpeakers;
