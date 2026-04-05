import { useState } from 'react';
import { Search, Star, Filter, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';

const AdminFeedback = () => {
    const [userFeedback, setUserFeedback] = useState([
        {
            title: "Tech Summit 2024",
            email: "alex.vance@gmail.com",
            date: "Oct 24, 2023",
            feedback: "The keynote speakers were incredible,...",
            rating: 5,
        },
        {
            title: "Design Week NYC",
            email: "sarah.j@outlook.com",
            date: "Oct 22, 2023",
            feedback: "Loved the networking lounge! Very co...",
            rating: 4,
        },
        {
            title: "Gourmet Expo",
            email: "m.rossi@foodie.it",
            date: "Oct 21, 2023",
            feedback: "The wine tasting session was...",
            rating: 5,
        },
        {
            title: "Yoga Flow Intensive",
            email: "zen@wellness.com",
            date: "Oct 20, 2023",
            feedback: "Absolute peace. Exactly what I neede...",
            rating: 5,
        },
        {
            title: "Startup Launchpad",
            email: "investor@venture.co",
            date: "Oct 19, 2023",
            feedback: "The pitching round was a bit rushed, b...",
            rating: 3,
        }
    ]);

    const handleRemove = (indexToRemove) => {
        setUserFeedback((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const totalResponses = userFeedback.length;
    const avgSatisfaction = totalResponses > 0
        ? (userFeedback.reduce((acc, curr) => acc + curr.rating, 0) / totalResponses).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-[#F4F6F8] font-sans text-slate-800 flex flex-col pb-12">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-sm animate-in fade-in duration-500">
                {/* Search Bar */}
                <div className="w-full max-w-xl relative group">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        className="w-full bg-slate-50 border border-slate-100 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all"
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-10">
                
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Feedback Overview</h1>
                  <p className="text-slate-500 font-medium">Monitor and manage all user event reviews</p>
                </div>

                {/* Top Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard 
                      title="Total Responses"
                      value={totalResponses.toLocaleString()}
                      trend={12}
                    />
                    <StatCard 
                      title="Avg. Satisfaction"
                      value={avgSatisfaction}
                      suffix="/ 5.0"
                      color="#FBBF24"
                    />
                    <StatCard 
                      title="Response Rate"
                      value="64%"
                      color="#6366F1"
                    />
                </div>

                {/* Recent Submissions Table */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
                    {/* Table Header Area */}
                    <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
                        <h3 className="text-xl font-bold text-slate-900">Recent Submissions</h3>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" icon={Filter}>
                                Filter
                            </Button>
                            <Button variant="primary" size="sm" icon={Download}>
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Event Title</th>
                                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Feedback</th>
                                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {userFeedback.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center font-bold text-slate-400 text-xs">
                                                  {item.title.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{item.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-500 font-medium whitespace-nowrap">
                                            {item.email}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-500 font-medium whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="px-8 py-6 min-w-[300px]">
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex items-center gap-1">
                                                  {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                      key={i} 
                                                      size={12} 
                                                      className={`${i < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-100'}`} 
                                                    />
                                                  ))}
                                                  <span className="text-[11px] ml-1 font-bold text-slate-500">{item.rating}.0</span>
                                              </div>
                                              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed italic">"{item.feedback}"</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                              onClick={() => handleRemove(index)}
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {userFeedback.length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center">
                                <div className="text-4xl mb-4 opacity-20">📫</div>
                                <p className="text-slate-400 font-medium">No feedback submissions found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminFeedback;

