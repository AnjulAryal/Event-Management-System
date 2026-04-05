import React, { useState, useEffect } from 'react';
import { Filter, CalendarDays, MapPin, X, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isMonthOnly, setIsMonthOnly] = useState(false);
    
    // Get current month abbreviation
    const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date());

    // Data Object
    const [dashboardData, setDashboardData] = useState({
        totalEvents: 0,
        activeAttendees: "18.5k",
        todayEvents: [
            {
                id: 1,
                time: "10:00 AM",
                location: "Main Auditorium",
                title: "DevCorps",
                category: "Technology",
                description: "A deep dive into modern DevOps practices, cloud deployment, and scalable system design for developers.",
                attending: 842,
                color: "#c63636",
                month: currentMonth
            },
            {
                id: 2,
                time: "06:00 PM",
                location: "Rooftop Terrace",
                title: "After Hours Networking: Founders & VCs",
                category: "Business",
                description: "Casual networking event for series-A startups and private equity investors. Open bar and ho...",
                attending: 124,
                color: "#c63636",
                month: currentMonth
            }
        ],
        upcomingEvents: [
            { id: 1, month: "Oct", day: "24", title: "Modern Art Gala 2024", category: "Arts", location: "Metropolitan Gallery", attending: "2.4k" },
            { id: 2, month: "Oct", day: "28", title: "Sustainability Expo", category: "Environment", location: "Green Hall", attending: "1.1k" },
            { id: 3, month: "Nov", day: "02", title: "Product Design Workshop", category: "Design", location: "Remote/Digital", attending: "450" }
        ]
    });

    useEffect(() => {
        // Calculate Total Events from localStorage
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setDashboardData(prev => ({
            ...prev,
            totalEvents: storedEvents.length || 1284 // fallback to dummy stat if none
        }));
    }, []);

    const categories = ['All', 'Technology', 'Business', 'Arts', 'Design', 'Environment'];

    // Combine filters: Category + Time Range
    const getFilteredEvents = (list) => {
        let filtered = list;
        
        if (activeFilter !== 'All') {
            filtered = filtered.filter(e => e.category === activeFilter);
        }
        
        if (isMonthOnly) {
            filtered = filtered.filter(e => e.month === currentMonth);
        }
        
        return filtered;
    };

    const filteredTodayEvents = getFilteredEvents(dashboardData.todayEvents);
    const filteredUpcomingEvents = getFilteredEvents(dashboardData.upcomingEvents);

    const handleFilterButtonClick = () => {
        setShowFilters(!showFilters);
    };

    const handleCategorySelect = (category) => {
        setActiveFilter(category);
        toast.success(`Filtering category: ${category}`);
    };

    const handleTimeRangeClick = () => {
        const newState = !isMonthOnly;
        setIsMonthOnly(newState);
        toast.success(newState ? `Showing only ${currentMonth} events` : "Showing all events");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-800 animate-in fade-in duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome back, <span className="text-green-500">Admin</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Here is the current state of your event ecosystem for the next 24 hours.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button 
                        variant={showFilters ? "primary" : "secondary"} 
                        icon={showFilters ? X : Filter} 
                        onClick={handleFilterButtonClick}
                    >
                        {showFilters ? "Close Filters" : "Filters"}
                    </Button>
                    <Button 
                        variant={isMonthOnly ? "primary" : "secondary"} 
                        icon={CalendarDays} 
                        onClick={handleTimeRangeClick}
                    >
                        {isMonthOnly ? `Only ${currentMonth}` : "This Month"}
                    </Button>
                </div>
            </div>

            {/* Animated Filter Bar */}
            {showFilters && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Browse Categories:</span>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                    activeFilter === category 
                                    ? "bg-[#5CB85C] text-white shadow-md shadow-green-500/20 scale-105" 
                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard label="Total Events" value={dashboardData.totalEvents.toLocaleString()} color="#5CB85C" />
                        <StatCard label="Active Attendees" value={dashboardData.activeAttendees} color="#5CB85C" />
                    </div>

                    {/* Today's Events */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <Badge variant="primary">Priority</Badge>
                                <h2 className="text-2xl font-bold text-slate-900">Today's Events</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {isMonthOnly && <Badge variant="blue" className="bg-blue-50 text-blue-600">{currentMonth} Only</Badge>}
                                {activeFilter !== 'All' && (
                                    <span className="text-sm font-medium text-slate-400">
                                        in <span className="text-green-500 font-bold">{activeFilter}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredTodayEvents.map(event => (
                                <div key={event.id} className="bg-white p-5 rounded-[20px] shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all border border-transparent hover:border-slate-100 group cursor-pointer animate-in fade-in slide-in-from-bottom-2">
                                    <div className="w-full sm:w-40 h-40 bg-[#c63636] rounded-xl flex-shrink-0 group-hover:scale-[1.02] transition-transform"></div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <Badge variant="blue">{event.time}</Badge>
                                                <Badge variant="secondary" className="bg-slate-50">{event.category}</Badge>
                                                <div className="flex items-center text-slate-500 text-sm font-medium">
                                                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#c63636]" />
                                                    {event.location}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{event.title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                                {event.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-green-500 font-semibold text-sm">+{event.attending} attending</span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredTodayEvents.length === 0 && (
                                <div className="py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <CalendarDays className="w-8 h-8 opacity-20" />
                                    </div>
                                    <p className="font-bold text-lg text-slate-500 mb-1">No matches found</p>
                                    <p className="text-sm">Try adjusting your filters or switching back to "All Time".</p>
                                    <button 
                                        onClick={() => { setActiveFilter('All'); setIsMonthOnly(false); }}
                                        className="mt-4 text-[#5CB85C] font-bold text-sm hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <h2 className="text-[22px] font-bold text-slate-900 mb-6 mt-2 xl:mt-0 xl:mb-6">Upcoming Events</h2>

                    <div className="space-y-4">
                        {filteredUpcomingEvents.map(event => (
                            <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 hover:bg-slate-50/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 animate-in fade-in slide-in-from-right-4">
                                <div className="bg-slate-50/80 p-3 rounded-xl flex flex-col items-center justify-center min-w-[64px]">
                                    <span className="text-green-500 text-xs font-bold uppercase tracking-wider mb-0.5">{event.month}</span>
                                    <span className="text-xl font-extrabold text-slate-900">{event.day}</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-slate-900 truncate">{event.title}</h4>
                                    <p className="text-sm text-slate-500 mt-0.5 truncate">{event.category} • {event.attending} Attending</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90" />
                            </div>
                        ))}
                        {filteredUpcomingEvents.length === 0 && (
                            <div className="py-8 bg-slate-50/30 rounded-xl border border-dashed border-slate-100 text-center flex flex-col items-center">
                                <p className="text-slate-400 text-sm font-medium italic">Nothing scheduled yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

