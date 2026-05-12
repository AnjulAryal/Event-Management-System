import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, TrendingUp } from 'lucide-react';

const AdminEventAttendees = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
                        const email = user.email || 'unknown@domain.com';

                        return {
                            id: user._id || idx,
                            name: user.name || 'UNKNOWN',
                            event: eventData.title || 'UNKNOWN EVENT',
                            email,
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

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredAttendees = attendees.filter((attendee) => {
        if (!normalizedSearch) return true;

        return `${attendee.name} ${attendee.event} ${attendee.email}`
            .toLowerCase()
            .includes(normalizedSearch);
    });

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800 flex flex-col pb-12">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-sm">
                <div className="relative w-full max-w-lg group">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search attendees..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-[13px] rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </header>

            <main className="flex-1 px-6 py-6 md:px-8 max-w-[980px] w-full mx-auto">
                <div className="mb-8 flex items-center gap-3 text-[12px] font-semibold text-slate-500">
                    <button
                        type="button"
                        onClick={() => navigate('/admin-events')}
                        className="transition hover:text-[#5CB85C]"
                    >
                        Events
                    </button>
                    <span className="text-slate-300">›</span>
                    <span className="font-bold text-slate-900">Attendees</span>
                </div>

                <section className="mb-9">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 w-full max-w-[280px]">
                        <h3 className="text-[#5CB85C] font-bold text-[12px] mb-2 tracking-wide">Total Attendees</h3>
                        <div className="text-[32px] leading-none font-extrabold text-slate-950 mb-2">
                            {loading ? '...' : attendees.length.toLocaleString()}
                        </div>
                        <div className="flex items-center text-[#5CB85C] text-[11px] font-bold">
                            <TrendingUp className="w-3 h-3 mr-1" strokeWidth={2.5} />
                            Active tracking
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="border-b border-slate-200 px-6 py-5 text-center">
                        <h2 className="text-[15px] font-extrabold text-slate-950">Attendees Information</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.16em] w-1/3">Attendees Name</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.16em] w-1/3">Event Title</th>
                                    <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.16em] w-1/3">Mail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="py-16 text-center text-slate-400 font-bold text-sm">
                                            Loading attendees...
                                        </td>
                                    </tr>
                                ) : filteredAttendees.length > 0 ? (
                                    filteredAttendees.map((attendee) => (
                                        <tr key={attendee.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                                            <td className="px-10 py-7 text-[12px] font-bold text-slate-700 tracking-wide uppercase">
                                                {attendee.name}
                                            </td>
                                            <td className="px-10 py-7 text-[12px] font-bold text-slate-700 tracking-wide uppercase">
                                                {attendee.event}
                                            </td>
                                            <td className="px-10 py-7 text-[12px] font-bold text-slate-700 leading-5 tracking-wide uppercase">
                                                {attendee.email}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-16 text-center text-slate-400 font-bold text-sm">
                                            No attendees found{searchQuery ? ` matching "${searchQuery}"` : '.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminEventAttendees;
