import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bell, Search, TrendingUp } from 'lucide-react';

const AdminEventAttendees = () => {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [attendees, setAttendees] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (res.ok) {
                    const eventData = await res.json();
                    
                    const participants = eventData.registeredParticipants || [];
                    const formatted = participants.map((user, idx) => {
                        const emailParts = user.email ? user.email.split('@') : ['unknown', 'domain.com'];
                        return {
                            id: user._id || idx,
                            name: user.name || 'UNKNOWN',
                            event: eventData.title || 'UNKNOWN EVENT',
                            emailPrefix: emailParts[0],
                            emailSuffix: '@' + (emailParts[1] || 'domain.com')
                        };
                    });
                    setAttendees(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch attendees:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAttendees();
    }, [id]);

    const filteredAttendees = attendees.filter(att => 
        att.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (att.emailPrefix + att.emailSuffix).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] w-full flex flex-col font-sans">
            
            {/* Top Bar Navigation Area */}
            <div className="w-full flex justify-end p-6 md:px-12 md:pt-8 bg-transparent">
            </div>

            <div className="px-6 md:px-12 pb-12 overflow-y-auto w-full max-w-[1400px] mx-auto">
                {/* Total Attendees Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] border border-slate-50 max-w-[320px] mb-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-[#5CB85C] font-semibold text-[13px] mb-2 tracking-wide">Total Attendees</h3>
                    <div className="text-[2.75rem] leading-none font-extrabold text-slate-900 mb-3">{loading ? '...' : attendees.length.toLocaleString()}</div>
                    <div className="flex items-center text-[#5CB85C] text-xs font-bold tracking-wide">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
                        Active tracking
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 max-w-2xl w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-[#8aa0ba]" strokeWidth={2} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Event..."
                        className="w-full bg-[#f3f7f9] text-slate-700 text-sm font-medium placeholder-[#8aa0ba] rounded-2xl py-4 flex items-center pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/30 transition-all border-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Attendees Information Table */}
                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] border border-slate-50 w-full overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <h2 className="text-xl font-bold text-[#1e293b] mb-10 tracking-tight">Attendees Information</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-8 text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.15em] w-1/3">ATTENDES NAME</th>
                                    <th className="pb-8 text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.15em] w-1/3">EVENT TITLE</th>
                                    <th className="pb-8 text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.15em] w-1/3">MAIL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendees.length > 0 ? (
                                    filteredAttendees.map((attendee) => (
                                        <tr key={attendee.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                            <td className="py-7 text-[13px] font-bold text-[#334155] tracking-wide uppercase">
                                                {attendee.name}
                                            </td>
                                            <td className="py-7 text-[13px] font-bold text-[#334155] tracking-wide uppercase">
                                                {attendee.event}
                                            </td>
                                            <td className="py-5 text-[13px] font-bold text-[#334155] leading-[1.4] tracking-wide uppercase">
                                                <div className="block">{attendee.emailPrefix}</div>
                                                <div className="block">{attendee.emailSuffix}</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-16 text-center text-slate-400 font-medium text-sm">
                                            No attendees found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEventAttendees;
