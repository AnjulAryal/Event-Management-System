import React from 'react';
import { CloudUpload, MapPin, ChevronDown } from 'lucide-react';

const AdminEditEvent = () => {
    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight mb-2">
                        Edit <span className="text-[#82c653]">Event</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[15px] max-w-2xl leading-relaxed">
                        Design a memorable experience. Fill in the details below to orchestrate your next masterpiece.
                    </p>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Column (Wider) */}
                    <div className="flex-1 space-y-6">

                        {/* Box 1: Core Details */}
                        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100">
                            {/* Event Title */}
                            <div className="mb-6">
                                <label className="block text-[11px] font-bold text-[#82c653] uppercase tracking-widest mb-3" htmlFor="eventTitle">
                                    EVENT TITLE
                                </label>
                                <input
                                    id="eventTitle"
                                    type="text"
                                    placeholder="e.g. Global Tech Summit 2024"
                                    className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#82c653] uppercase tracking-widest mb-3" htmlFor="description">
                                    DESCRIPTION
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="Describe the soul of this event..."
                                    rows={4}
                                    className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Box 2: Logistics & Venue */}
                        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center mb-6">
                                <MapPin className="w-[18px] h-[18px] text-[#82c653] mr-2 shrink-0" strokeWidth={2.5} />
                                <h3 className="text-[11px] font-bold text-[#82c653] uppercase tracking-widest">
                                    LOGISTICS & VENUE
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Date */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                        DATE
                                    </label>
                                    <input
                                        type="date"
                                        className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none [color-scheme:light]"
                                    />
                                </div>
                                {/* Time */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                        TIME
                                    </label>
                                    <input
                                        type="time"
                                        className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none [color-scheme:light]"
                                    />
                                </div>
                                {/* Venue Name */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                        VENUE NAME
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="The Grand Hall"
                                        className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none"
                                    />
                                </div>
                                {/* City / Location */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                        CITY / LOCATION
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="San Francisco, CA"
                                        className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Box 3: Additional Details */}
                        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Organizer */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                        ORGANIZER
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Department of Innovation"
                                        className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none"
                                    />
                                </div>
                                {/* Admin Notes */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                        ADMIN NOTES (PRIVATE)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Internal billing reference..."
                                        className="block w-full bg-[#f4f6f8] text-slate-700 placeholder-slate-400 text-sm py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Narrower Sidebar) */}
                    <div className="w-full lg:w-[340px] shrink-0 space-y-6">

                        {/* Box 4: Event Cover Image */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col h-[320px]">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4 shrink-0">
                                EVENT COVER IMAGE
                            </label>
                            <div className="flex-1 w-full border-2 border-dashed border-slate-200/80 rounded-[24px] flex flex-col items-center justify-center p-6 bg-white hover:bg-[#f8fafc]/50 transition-colors cursor-pointer group">
                                <div className="w-[52px] h-[52px] rounded-full bg-[#f4f6f8] flex items-center justify-center mb-4 group-hover:bg-[#eaf1ec] transition-colors">
                                    <CloudUpload className="w-[22px] h-[22px] text-[#82c653]" strokeWidth={2.5} />
                                </div>
                                <p className="text-[13px] font-bold text-[#1f2937] text-center mb-3">
                                    Click to upload or<br />drag and drop
                                </p>
                                <div className="text-[10px] text-slate-400 text-center leading-[1.6]">
                                    <p>PNG, JPG or WEBP (Max</p>
                                    <p>5MB)</p>
                                    <p>Recommended:</p>
                                    <p>1600×900px</p>
                                </div>
                            </div>
                        </div>

                        {/* Box 5: Category & Actions */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                            <div className="mb-6">
                                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                    CATEGORY
                                </label>
                                <div className="relative">
                                    <select
                                        className="block w-full bg-[#f4f6f8] text-slate-700 text-sm py-3.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#82c653]/30 transition-all border-none appearance-none font-medium cursor-pointer"
                                        defaultValue="technology"
                                    >
                                        <option value="technology">Technology & Innovation</option>
                                        <option value="business">Business & Finance</option>
                                        <option value="arts">Arts & Culture</option>
                                        <option value="health">Health & Wellness</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-[#82c653] hover:bg-[#72b048] text-white font-bold text-sm py-4 rounded-[14px] transition-colors shadow-[0_2px_12px_rgba(130,198,83,0.3)] flex items-center justify-center">
                                    Edit Event
                                </button>
                                <button className="w-full bg-[#e8eaed] hover:bg-[#dfe1e5] text-[#1f2937] font-bold text-sm py-3.5 rounded-[14px] transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEditEvent;
