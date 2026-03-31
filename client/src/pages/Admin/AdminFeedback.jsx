import React, { useState } from 'react';
import { Search, ArrowUp, Star, Filter, Download } from 'lucide-react';

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
  
  // Convert avgSatisfaction to nearest integer for rendering full stars
  const roundedStars = Math.round(Number(avgSatisfaction));

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-slate-800 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-[0_1px_2px_rgba(0,0,0,0.03)] border-b border-transparent">
        {/* Search Bar */}
        <div className="w-full max-w-xl relative">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search feedback..." 
            className="w-full bg-slate-50/80 border border-slate-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1250px] w-full mx-auto space-y-7">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-6">
            <p className="text-[#4caf50] text-sm font-bold mb-2">Total Responses</p>
            <h2 className="text-[32px] font-extrabold text-slate-800 mb-2 leading-none">{totalResponses.toLocaleString()}</h2>
            <div className="flex items-center text-[#4caf50] text-xs font-bold mt-3">
              <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
              <span>12% from last month</span>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-6">
            <p className="text-[#4caf50] text-sm font-bold mb-2">Avg. Satisfaction</p>
            <h2 className="text-[32px] font-extrabold text-slate-800 mb-2 leading-none">
              {avgSatisfaction} <span className="text-xl text-slate-500 font-semibold tracking-wide">/ 5.0</span>
            </h2>
            <div className="flex items-center space-x-1 mt-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i <= roundedStars ? 'fill-[#ffc107] text-[#ffc107]' : 'fill-slate-200 text-slate-200'}`} 
                />
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-6 flex flex-col justify-between">
            <div>
              <p className="text-[#4caf50] text-sm font-bold mb-2">Response Rate</p>
              <h2 className="text-[32px] font-extrabold text-slate-800 mb-2 leading-none">64%</h2>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full flex overflow-hidden mt-3">
               <div className="h-full bg-[#4caf50] w-[64%]"></div>
               <div className="h-full bg-[#2196f3] w-[20%]"></div>
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="bg-white rounded-[16px] shadow-sm border-[3px] border-[#2196f3] flex flex-col min-h-[500px]">
          {/* Table Header Area */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800">Recent Submissions</h3>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-md hover:bg-slate-50 transition shadow-sm">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="flex items-center gap-2 bg-[#5cb85c] hover:bg-[#4ea84e] text-white font-bold text-xs px-4 py-2 rounded-md transition shadow-sm">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[25%]">Event Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feedback</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {userFeedback.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 transition duration-150">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded shrink-0 bg-[#eef2fc]"></div>
                        <span className="font-bold text-slate-800 text-[14px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-[13px] text-slate-400 font-medium">
                      {item.email}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-[13px] text-slate-400 font-medium">
                      {item.date}
                    </td>
                    <td className="px-6 py-5 truncate max-w-[280px] text-[13px] text-slate-400 font-medium flex items-center gap-2">
                       <div className="flex shrink-0">
                         {/* Display mini stars in the table for extra clarity since the user mentioned "ratings stars" */}
                         <Star className={`w-3 h-3 ${item.rating >= 1 ? 'fill-[#ffc107] text-[#ffc107]' : 'fill-slate-200 text-slate-200'}`} />
                         <span className="text-[10px] ml-1 font-bold text-slate-500">{item.rating}</span>
                       </div>
                       <span className="truncate">{item.feedback}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <button 
                        onClick={() => handleRemove(index)}
                        className="text-[#ef5350] hover:text-red-700 font-bold text-[13px] transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {userFeedback.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                      No feedback submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default AdminFeedback;
