import React, { useState } from 'react';
import { Search, Filter, Download, Star } from 'lucide-react';

const AdminFeedback = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [userFeedback, setUserFeedback] = useState([
        {
            title: "Tech Summit 2024",
            email: "alex.vance@gmail.com",
            date: "Oct 24, 2023",
            feedback: "The keynote speakers were incredible,...",
        },
        {
            title: "Design Week NYC",
            email: "sarah.j@outlook.com",
            date: "Oct 22, 2023",
            feedback: "Loved the networking lounge! Very co...",
        },
        {
            title: "Gourmet Expo",
            email: "m.rossi@foodie.it",
            date: "Oct 21, 2023",
            feedback: "The wine tasting session was...",
        },
        {
            title: "Yoga Flow Intensive",
            email: "zen@wellness.com",
            date: "Oct 20, 2023",
            feedback: "Absolute peace. Exactly what I neede...",
        },
        {
            title: "Startup Launchpad",
            email: "investor@venture.co",
            date: "Oct 19, 2023",
            feedback: "The pitching round was a bit rushed, b...",
        }
    ]);

    const handleRemove = (indexToRemove) => {
        setUserFeedback((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleExportCSV = () => {
        const headers = ["Event Title", "Email", "Date", "Feedback"];
        const csvRows = [headers.join(",")];

        userFeedback.forEach((item) => {
            const row = [
                `"${item.title.replace(/"/g, '""')}"`,
                `"${item.email.replace(/"/g, '""')}"`,
                `"${item.date.replace(/"/g, '""')}"`,
                `"${item.feedback.replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "feedback_export.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filteredFeedback = userFeedback.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.feedback.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-12 flex flex-col">
            {/* Top Search Bar */}
            <div className="bg-white px-6 py-4 flex justify-center border-b border-gray-100">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search feedback..."
                        className="w-full bg-[#f8fafc] border border-transparent rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-slate-300 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-[1100px] mx-auto p-6 md:p-8 space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-center">
                        <h3 className="text-[13px] font-bold text-[#5cb85c] mb-2 leading-none cursor-default">Total Responses</h3>
                        <div className="text-[32px] font-extrabold text-[#1e293b] leading-none mb-2">1,284</div>
                        <div className="text-[12px] font-bold text-[#5cb85c]">↑ 12% from last month</div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-center">
                        <h3 className="text-[13px] font-bold text-[#5cb85c] mb-2 leading-none cursor-default">Avg. Satisfaction</h3>
                        <div className="text-[32px] font-extrabold text-[#1e293b] leading-none mb-2">4.8 / 5.0</div>
                        <div className="flex items-center gap-[2px]">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-3.5 h-3.5 fill-[#fbbf24] text-[#fbbf24]" />
                            ))}
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-center">
                        <h3 className="text-[13px] font-bold text-[#5cb85c] mb-2 leading-none cursor-default">Response Rate</h3>
                        <div className="text-[32px] font-extrabold text-[#1e293b] leading-none mb-3">64%</div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#5cb85c] w-[64%]"></div>
                            <div className="h-full bg-[#3b82f6] w-[36%]"></div>
                        </div>
                    </div>
                </div>

                {/* Submissions Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-6 border-b border-gray-100 gap-4">
                        <h2 className="text-xl font-bold text-[#1e293b]">Recent Submissions</h2>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                <Filter className="w-3.5 h-3.5" /> Filter
                            </button>
                            <button 
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-[#5cb85c] text-white rounded-lg text-[13px] font-bold shadow-sm hover:bg-[#4cae4c] active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5" /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-8 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Event Title</th>
                                    <th className="px-8 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Feedback</th>
                                    <th className="px-8 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/60">
                                {filteredFeedback.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-[10px] bg-[#eef2ff] shrink-0"></div>
                                                <span className="font-bold text-[#1e293b] text-[13px] whitespace-nowrap">{item.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[13px] text-slate-400 font-medium whitespace-nowrap">
                                            {item.email}
                                        </td>
                                        <td className="px-8 py-5 text-[13px] text-slate-400 font-medium whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="px-8 py-5 text-[13px] text-slate-400 font-medium min-w-[250px]">
                                            {item.feedback}
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => handleRemove(userFeedback.indexOf(item))}
                                                className="text-[13px] font-bold text-[#ef4444] hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredFeedback.length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center">
                                <div className="text-4xl mb-4 opacity-20">📫</div>
                                <p className="text-slate-400 font-medium">No feedback submissions found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminFeedback;
