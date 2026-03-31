import React from 'react';
import { Search, MapPin, CalendarDays, ChevronDown, ArrowRight, Edit, Trash2 } from 'lucide-react';

const AdminEvent = () => {
  // Generate 9 dummy events to match the 3x3 grid in the screenshot
  const eventItems = Array(9).fill({
    title: "UI/UX Design",
    location: "Creative Hub, ...",
    date: "Dec 01, 2024",
    badge: "UI/UX DESIGN",
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 flex flex-col">
      
      {/* Top Navigation Bar Component (Included as per screenshot) */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 w-full">
        <div className="w-1/3"></div> {/* Spacer to center the search bar properly */}
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xl flex justify-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-full py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Logout Button */}
        <div className="w-1/3 flex justify-end">
          <button className="flex items-center gap-1.5 bg-[#5cb85c] hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm transition">
            Logout 
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1300px] w-full mx-auto">
        <h1 className="text-[34px] font-bold text-slate-800 mb-6">Events</h1>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-2">
          
          {/* Left side filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Date Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm min-w-[220px]">
              <CalendarDays className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="mm/dd/yyyy"
                className="w-full text-sm outline-none text-slate-600 bg-transparent placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm min-w-[220px] cursor-pointer hover:bg-slate-50 transition">
              <span className="text-sm text-slate-500">All Categories</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Right side Apply Filters Button */}
          <button className="bg-[#5cb85c] hover:bg-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition sm:ml-auto mt-4 sm:mt-0">
            Apply Filters
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventItems.map((event, index) => (
            <div key={index} className="bg-white rounded-[20px] shadow-sm p-4 flex flex-col hover:shadow-md transition duration-200 border border-slate-100/50">
              
              {/* Card Image Area */}
              <div 
                className={`relative h-44 rounded-xl bg-[#1d2230] flex flex-col items-center justify-center overflow-hidden
                  ${index === 0 ? 'ring-[3px] ring-[#3b99fc] ring-offset-0' : ''}
                `}
              >
                {/* Badge top right */}
                <span className="absolute top-3 right-3 bg-[#3b99fc] text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm z-10">
                  {event.badge}
                </span>
                
                {/* Center text 'UX' */}
                <span className="text-4xl font-extrabold text-[#5c6a8a] tracking-tight relative z-0">UX</span>
              </div>

              {/* Card Body */}
              <div className="mt-4 mb-4 flex-1">
                <h3 className="text-[17px] font-bold text-slate-900 mb-2">{event.title}</h3>
                
                <div className="space-y-1.5">
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-500 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer (Buttons) */}
              <div className="border-t border-slate-100 pt-5 mt-auto flex items-center justify-between gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[14.5px] py-2.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <Edit className="w-4 h-4 text-slate-500" />
                      Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#ffdbdb] hover:bg-red-50 text-[#fa5252] font-bold text-[14.5px] py-2.5 rounded-xl transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <Trash2 className="w-4 h-4" />
                      Delete
                  </button>
              </div>

            </div>
          ))}
        </div>
      </main>

    </div>
  );
};

export default AdminEvent;
