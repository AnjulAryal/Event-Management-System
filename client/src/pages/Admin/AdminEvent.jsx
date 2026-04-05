import React from 'react';
import { Search, MapPin, CalendarDays, ChevronDown, ArrowRight, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import EventCard from '../../components/ui/EventCard';
import Badge from '../../components/ui/Badge';

const AdminEvent = () => {
    // Generate 9 dummy events to match the 3x3 grid
    const eventItems = Array(9).fill({
        title: "UI/UX Design",
        location: "Creative Hub, ...",
        date: "Dec 01, 2024",
        category: "UI/UX DESIGN",
        categoryColor: "#3b99fc"
    });

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 flex flex-col pb-12">

            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 w-full animate-in fade-in duration-500">
                <div className="w-1/3"></div>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl flex justify-center">
                    <div className="relative w-full max-w-md group">
                        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-green-500 transition-colors">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full bg-slate-50 border border-slate-100 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white focus:border-green-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <div className="w-1/3 flex justify-end">
                    <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Events</h1>

                {/* Filters Section */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between mb-10 gap-6">

                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Date Filter */}
                        <div className="flex flex-col gap-2 flex-1 max-w-xs">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Date</label>
                            <div className="flex items-center bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm group focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                                <CalendarDays className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-green-500" />
                                <input
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full text-sm outline-none text-slate-700 bg-transparent placeholder-slate-300"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-col gap-2 flex-1 max-w-xs">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm cursor-pointer hover:bg-slate-50 transition-all group focus-within:ring-2 focus-within:ring-green-500/20">
                                <span className="text-sm text-slate-500 font-medium">All Categories</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <Button variant="primary" className="lg:mb-0 px-8">
                        Apply Filters
                    </Button>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventItems.map((event, index) => (
                        <EventCard 
                            key={index} 
                            event={event}
                            showButtons={false}
                            className={index === 0 ? 'ring-2 ring-blue-500/50' : ''}
                            customActions={
                                <div className="flex items-center justify-between gap-3">
                                    <Button variant="secondary" size="md" className="flex-1 rounded-xl" icon={Edit}>
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="md" className="flex-1 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-50 transition-colors" icon={Trash2}>
                                        Delete
                                    </Button>
                                </div>
                            }
                        />
                    ))}
                </div>
            </main>

        </div>
    );
};

export default AdminEvent;

