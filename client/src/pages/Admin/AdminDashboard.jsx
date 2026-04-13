import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
    const [dateFilter, setDateFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [appliedFilters, setAppliedFilters] = useState({ date: '', category: 'All Categories' });

    const [dashboardData, setDashboardData] = useState({
        totalEvents: 0,
        activeAttendees: "0",
        todayEvents: [],
        upcomingEvents: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) throw new Error('Failed to fetch events');
                const data = await res.json();
                const events = Array.isArray(data) ? data : (data.events || []);

                let activeAttendees = 0;
                const todayEvents = [];
                const upcomingEvents = [];

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                events.forEach(event => {
                    const attendingCount = event.registeredParticipants ? event.registeredParticipants.length : 0;
                    activeAttendees += attendingCount;

                    // Parse the event date
                    let eDate = new Date(event.date);
                    if (isNaN(eDate.getTime())) {
                        eDate = new Date(); // fallback
                    } else {
                        eDate.setHours(0, 0, 0, 0);
                    }

                    if (eDate.getTime() === today.getTime()) {
                        todayEvents.push({
                            id: event._id || event.id || Math.random(),
                            time: event.time || "TBD",
                            location: event.location || "TBD",
                            title: event.title || "Untitled Event",
                            category: event.category || "General",
                            description: event.description && event.description.length > 90 
                                ? event.description.substring(0, 90) + "..." 
                                : (event.description || ""),
                            attending: attendingCount,
                            color: event.categoryColor || "#5CB85C",
                            date: event.date,
                            coverImage: event.coverImage
                        });
                    } else if (eDate > today) {
                        const month = eDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                        const day = eDate.getDate().toString().padStart(2, '0');
                        upcomingEvents.push({
                            id: event._id || event.id || Math.random(),
                            month: month,
                            day: day,
                            title: event.title || "Untitled Event",
                            location: event.location || "TBD",
                            attending: attendingCount >= 1000 
                                ? (attendingCount / 1000).toFixed(1) + "k" 
                                : attendingCount.toString(),
                            date: event.date,
                            category: event.category || "General"
                        });
                    }
                });

                upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

                let formattedAttendees = activeAttendees.toString();
                if (activeAttendees >= 1000) {
                    formattedAttendees = (activeAttendees / 1000).toFixed(1) + "k";
                }

                setDashboardData({
                    totalEvents: events.length,
                    activeAttendees: formattedAttendees,
                    todayEvents,
                    upcomingEvents
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleApplyFilters = () => {
        setAppliedFilters({ date: dateFilter, category: categoryFilter });
    };

    const getFilteredEvents = (list) => {
        let filtered = list;
        if (appliedFilters.category !== 'All Categories') {
            filtered = filtered.filter(e => e.category === appliedFilters.category);
        }
        if (appliedFilters.date) {
            filtered = filtered.filter(e => e.date === appliedFilters.date);
        }
        return filtered;
    };

    const filteredTodayEvents = getFilteredEvents(dashboardData.todayEvents);
    const filteredUpcomingEvents = getFilteredEvents(dashboardData.upcomingEvents);

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800 flex flex-col pb-12 w-full">
            <main className="flex-1 p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-700">

            {/* Header Section */}
            <div className="flex flex-col mb-8">
                <h1 className="text-[32px] font-extrabold tracking-tight text-slate-800">
                    Welcome back,<span className="text-[#5CB85C]">Admin</span>
                </h1>
                <p className="text-slate-400 mt-1 text-sm font-medium">
                    Here is the current state of your event ecosystem for the next 24 hours.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
                
                {/* Left Column (Spans 2 columns) */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    
                    {/* Filters Row */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full">
                        <div className="flex items-center gap-3 border border-slate-100 bg-white rounded-lg px-4 py-2 min-w-[200px] shadow-sm flex-1">

                            <input 
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-slate-400 text-sm font-medium w-full uppercase"
                            />
                        </div>
                        <div className="flex items-center border border-slate-100 bg-white rounded-lg px-4 py-2 min-w-[200px] shadow-sm relative flex-1">
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-slate-400 text-sm font-medium w-full appearance-none pr-8 cursor-pointer"
                            >
                                <option value="All Categories">All Categories</option>
                                <option value="Technology">Technology</option>
                                <option value="Business">Business</option>
                                <option value="Arts">Arts</option>
                                <option value="Design">Design</option>
                                <option value="Environment">Environment</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-300 absolute right-4 pointer-events-none" />
                        </div>
                        {/* Hidden on desktop, visible on mobile to keep flow */}
                        <div className="w-full xl:hidden">
                            <button 
                                onClick={handleApplyFilters}
                                className="bg-[#5CB85C] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors shadow-sm w-full"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pr-4">
                        <StatCard 
                            label="Total Events" 
                            value={dashboardData.totalEvents.toLocaleString()} 
                            color="#5CB85C" 
                            className="!shadow-none !border-x-0 !border-t-0 !border-slate-200" 
                        />
                        <StatCard 
                            label="Active Attendees" 
                            value={dashboardData.activeAttendees} 
                            color="#5CB85C" 
                            className="!shadow-none !border-x-0 !border-t-0 !border-slate-200" 
                        />
                    </div>

                    {/* Today's Events */}
                    <div className="mt-2">
                        <div className="mb-4">
                            <Badge variant="green" className="bg-green-100 text-green-600 mb-2 font-bold px-2 py-0.5 rounded text-[10px] tracking-widest uppercase">
                                Priority
                            </Badge>
                            <h2 className="text-[22px] font-bold text-slate-900 leading-none">Today's Events</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {filteredTodayEvents.map(event => (
                                <div key={event.id} className="bg-white p-4 rounded-[16px] shadow-sm flex flex-col sm:flex-row gap-5 border border-slate-50 relative overflow-hidden transition-all hover:shadow-md">
                                    <div className="w-full sm:w-[140px] h-[140px] rounded-[16px] flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: event.color }}>
                                        {event.coverImage && (
                                            <img 
                                                src={event.coverImage.startsWith('data:image') || event.coverImage.startsWith('http') ? event.coverImage : `http://localhost:5000${event.coverImage}`}
                                                alt={event.title}
                                                className="w-full h-full object-cover absolute inset-0"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col py-1 justify-center">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-blue-500 text-sm font-bold">{event.time}</span>
                                            <span className="flex items-center text-slate-400 text-xs font-medium">
                                                <MapPin className="w-[14px] h-[14px] mr-1.5 text-[#c63636]" />
                                                {event.location}
                                            </span>
                                        </div>
                                        <h3 className="text-[20px] font-bold text-slate-900 mb-1.5 leading-tight">{event.title}</h3>
                                        <p className="text-slate-400 text-xs leading-relaxed max-w-[90%] mb-3">
                                            {event.description}
                                        </p>
                                        <div className="mt-auto">
                                            <span className="text-[#5CB85C] font-bold text-[13px]">+{event.attending} attending</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredTodayEvents.length === 0 && (
                                <div className="py-12 bg-white rounded-[16px] border border-dashed border-slate-200 flex flex-col items-center justify-center">
                                    <p className="text-slate-500 font-medium text-sm">No priority events today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Spans 1 column) */}
                <div className="xl:col-span-1 flex flex-col pt-0">
                    
                    {/* Apply Filters Button Top-Aligned on Desktop */}
                    <div className="mb-10 hidden xl:block">
                        <button 
                            onClick={handleApplyFilters}
                            className="bg-[#5CB85C] hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-sm"
                        >
                            Apply Filters
                        </button>
                    </div>

                    <div>
                        <h2 className="text-[20px] font-bold text-slate-900 mb-5">Upcoming Events</h2>

                        <div className="space-y-3">
                            {filteredUpcomingEvents.map(event => (
                                <div key={event.id} className="bg-white p-3.5 rounded-[16px] shadow-sm flex items-center space-x-4 border border-slate-50 transition-all hover:bg-slate-50/50">
                                    <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex flex-col items-center justify-center min-w-[56px] min-h-[56px]">
                                        <span className="text-[#5CB85C] text-[10px] font-bold uppercase tracking-wider mb-0">{event.month}</span>
                                        <span className="text-[18px] font-extrabold text-slate-900 leading-none mt-1">{event.day}</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{event.title}</h4>
                                        <p className="text-[12px] text-slate-400 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {event.location} • {event.attending} Attending
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {filteredUpcomingEvents.length === 0 && (
                                <div className="py-8 bg-white rounded-[16px] border border-dashed border-slate-200 text-center flex flex-col items-center">
                                    <p className="text-slate-400 text-xs font-medium italic">Nothing scheduled yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

