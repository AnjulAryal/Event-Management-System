import React from 'react';

const AdminSpeakersEdit = () => {
    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 p-8 md:p-12 flex flex-col items-start w-full">

            <div className="w-full max-w-2xl mx-auto md:mx-0">
                {/* Header */}
                <div className="mb-8 pl-1">
                    <h1 className="text-[32px] font-extrabold text-[#2d333b] tracking-tight mb-1.5">Edit Speaker</h1>
                    <p className="text-slate-500 font-medium text-[15px]">Share your event experience with the team.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white p-6 sm:p-10 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 w-full space-y-7">

                    {/* Speaker Name Field */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[13px] font-bold text-[#5cb85c] tracking-wide">Speaker Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Sarayu Gautam"
                            className="bg-[#f8F9FB] border border-slate-200/80 text-slate-700 text-[14px] rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:bg-white transition placeholder-slate-400"
                        />
                    </div>

                    {/* Category Field */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[13px] font-bold text-[#5cb85c] tracking-wide">Category</label>
                        <input
                            type="text"
                            className="bg-[#f8F9FB] border border-slate-200/80 text-slate-700 text-[14px] rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:bg-white transition"
                        />
                    </div>

                    {/* Date Field */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[11px] uppercase font-bold text-[#5cb85c] tracking-wider">DATE</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 select-none">
                                <span className="text-[17px]">📅</span>
                            </span>
                            <input
                                type="text"
                                placeholder="mm/dd/yyyy"
                                className="w-full bg-[#f8F9FB] border border-slate-200/80 text-slate-700 text-[14px] rounded-[10px] pl-[42px] pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:bg-white transition placeholder-slate-400"
                            />
                        </div>
                    </div>

                    {/* Speaking At Field */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-[13px] font-bold text-[#5cb85c] tracking-wide">Speaking at</label>
                        <input
                            type="text"
                            placeholder="Share your experience about this event..."
                            className="bg-[#f8F9FB] border border-slate-200/80 text-slate-700 text-[14px] rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:bg-white transition placeholder-slate-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-3.5 rounded-[12px] transition shadow-[0_6px_15px_-3px_rgba(92,184,92,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(92,184,92,0.5)] active:translate-y-0.5 text-[15px]">
                            Edit a speaker
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminSpeakersEdit;
