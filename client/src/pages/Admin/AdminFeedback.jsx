import React, { useState, useEffect } from 'react';
import { Search, Download, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminFeedback = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [userFeedback, setUserFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user?.token;
                
                const res = await fetch('/api/feedback', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!res.ok) throw new Error('Failed to fetch feedback');
                
                const data = await res.json();
                setUserFeedback(data);
            } catch (error) {
                console.error("Error fetching feedback:", error);
                toast.error("Failed to load feedback");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const handleRemove = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;
            
            const res = await fetch(`/api/feedback/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!res.ok) throw new Error('Failed to delete feedback');
            
            setUserFeedback((prev) => prev.filter((item) => item._id !== id));
            toast.success("Feedback deleted successfully!");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            toast.error("Failed to delete feedback");
        }
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

    // --- Dynamic Stats Calculations --
    const totalResponses = userFeedback.length;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let thisMonthCount = 0;
    let lastMonthCount = 0;
    let totalScore = 0;

    userFeedback.forEach(item => {
        let d = new Date(item.date);
        if (isNaN(d.getTime())) d = new Date(item.createdAt);
        
        if (!isNaN(d.getTime())) {
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                thisMonthCount++;
            } else if (
                (currentMonth === 0 && d.getMonth() === 11 && d.getFullYear() === currentYear - 1) ||
                (d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear)
            ) {
                lastMonthCount++;
            }
        }

        const text = (item.feedback || "").toLowerCase();
        let score = 3; 
        if (/(excellent|amazing|incredible|love|great|good|awesome|perfect|peace|outstanding)/.test(text)) score += 1.5;
        if (/(bad|poor|terrible|awful|worse|hate|rushed)/.test(text)) score -= 1.5;
        if (text.length > 50) score += 0.5; 
        score = Math.min(Math.max(score, 1), 5); 
        totalScore += score;
    });

    const growthPercent = lastMonthCount === 0 
        ? (thisMonthCount > 0 ? 100 : 0) 
        : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
    const growthSign = growthPercent >= 0 ? "↑" : "↓";
    const growthColor = growthPercent >= 0 ? "text-[#5cb85c]" : "text-[#ef4444]";

    const avgSatisfaction = totalResponses > 0 ? (totalScore / totalResponses).toFixed(1) : "0.0";
    const expectedResponses = totalResponses > 0 ? totalResponses + Math.max(10, Math.floor(totalResponses * 0.2)) : 100;
    const responseRate = totalResponses > 0 ? Math.round((totalResponses / expectedResponses) * 100) : 0;

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-center">
                        <h3 className="text-[13px] font-bold text-[#5cb85c] mb-2 leading-none cursor-default">Total Responses</h3>
                        <div className="text-[32px] font-extrabold text-[#1e293b] leading-none mb-2">{totalResponses}</div>
                        <div className={`text-[12px] font-bold ${growthColor}`}>{growthSign} {Math.abs(growthPercent)}% from last month</div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col justify-center">
                        <h3 className="text-[13px] font-bold text-[#5cb85c] mb-2 leading-none cursor-default">Avg. Satisfaction</h3>
                        <div className="text-[32px] font-extrabold text-[#1e293b] leading-none mb-2">{avgSatisfaction} / 5.0</div>
                        <div className="flex items-center gap-[2px]">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(Number(avgSatisfaction)) ? 'fill-[#fbbf24] text-[#fbbf24]' : 'fill-slate-200 text-slate-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submissions Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-6 border-b border-gray-100 gap-4">
                        <h2 className="text-xl font-bold text-[#1e293b]">Recent Submissions</h2>
                        <div className="flex items-center gap-3">

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
                                                onClick={() => handleRemove(item._id)}
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
