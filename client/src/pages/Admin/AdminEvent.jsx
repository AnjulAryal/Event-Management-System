import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Plus, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminEvent = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [appliedFilters, setAppliedFilters] = useState({ date: '', category: 'All Categories' });

    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Initialize events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) throw new Error('Failed to fetch events');
                const data = await res.json();
                const mappedData = data.map(e => ({ ...e, id: e._id || e.id }));
                setEvents(mappedData);
            } catch (error) {
                console.error("Error fetching events:", error);
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const res = await fetch(`/api/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: user && user.token ? `Bearer ${user.token}` : ''
                    }
                });
                
                if (!res.ok) throw new Error('Failed to delete event');
                
                const updatedEvents = events.filter(e => e.id !== id);
                setEvents(updatedEvents);
                toast.success("Event deleted successfully!");
            } catch (error) {
                console.error("Error deleting event:", error);
                toast.error("Failed to delete event");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin-edit-event/${id}`);
    };

    const handleAttendees = (id) => {
        navigate(`/admin-event-attendees/${id}`);
    };

    const handleApplyFilters = () => {
        setAppliedFilters({ date: dateFilter, category: categoryFilter });
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !appliedFilters.date || event.date === appliedFilters.date;

        const matchesCategory = appliedFilters.category === 'All Categories' ||
            (event.category && event.category.toUpperCase() === appliedFilters.category.toUpperCase());

        return matchesSearch && matchesDate && matchesCategory;
    });

    const getShortText = (title, category) => {
        if (category?.toUpperCase().includes('UX') || title?.toUpperCase().includes('UX')) return 'UX';
        return title?.substring(0, 2).toUpperCase() || 'EV';
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800 flex flex-col pb-12">
            
            {/* Top Navigation Bar / Search Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-sm">
                <div className="relative w-full max-w-lg group">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-[13px] rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight">Events</h1>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center mb-10 w-full">
                    <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-3 py-2 min-w-[180px] shadow-sm flex-1 sm:flex-none">
                        
                        <input 
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-transparent border-none outline-none text-slate-400 text-sm font-medium w-full flex-1"
                            data-placeholder="mm/dd/yyyy"
                        />
                    </div>
                    
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg px-3 py-2 min-w-[200px] shadow-sm relative flex-1 sm:flex-none">
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent border-none outline-none text-slate-400 text-sm font-medium w-full appearance-none pr-8 cursor-pointer"
                        >
                            <option value="All Categories">All Categories</option>
                            <option value="UI/UX DESIGN">UI/UX Design</option>
                            <option value="TECHNOLOGY">Technology</option>
                            <option value="BUSINESS">Business</option>
                            <option value="ARTS">Arts</option>
                            <option value="DESIGN">Design</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-300 absolute right-3 pointer-events-none" />
                    </div>
                    
                    {/* Optional Apply Filters Button */}
                    <div className="ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                        <button 
                            onClick={handleApplyFilters} 
                            className="bg-[#5CB85C] hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow-sm transition-colors w-full"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-t-xl rounded-b-[14px] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] flex flex-col h-full overflow-hidden border border-slate-100 transition-all hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)]">
                            
                            {/* Card Top / Graphic */}
                            <div className="relative h-40 w-full flex items-center justify-center bg-[#1c2331] overflow-hidden">
                                {event.coverImage ? (
                                    <img 
                                        src={event.coverImage.startsWith('data:image') || event.coverImage.startsWith('http') ? event.coverImage : `http://localhost:5000${event.coverImage}`}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-[#5973a8] text-[56px] font-black tracking-tight select-none">
                                        {getShortText(event.title, event.category)}
                                    </span>
                                )}
                                
                                {event.category && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-[#3b82f6] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide uppercase">
                                            {event.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-4 flex flex-col flex-1 bg-white">
                                
                                {/* Info and Actions Split */}
                                <div className="flex justify-between items-start mb-4 gap-2">
                                    {/* Left: Info */}
                                    <div className="flex flex-col flex-1 truncate pr-2">
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 truncate">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center text-[11px] text-slate-500 font-medium mb-1 line-clamp-1">
                                            <MapPin className="w-3 h-3 text-[#e03131] mr-1 flex-shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center text-[11px] text-slate-500 font-medium line-clamp-1">
                                            <CalendarDays className="w-3 h-3 text-[#9ca3af] mr-1 flex-shrink-0" />
                                            <span className="truncate">{event.date}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Right: Small Buttons */}
                                    <div className="flex flex-col gap-1.5 flex-shrink-0 min-w-[76px]">
                                        <button 
                                            onClick={() => handleEdit(event.id)} 
                                            className="bg-[#5CB85C] hover:bg-[#4aa14a] active:bg-[#3d8b3d] text-white text-[11px] font-bold py-1 px-4 w-full rounded focus:outline-none transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event.id)} 
                                            className="bg-[#e53e3e] hover:bg-[#c53030] active:bg-[#9b2c2c] text-white text-[11px] font-bold py-1 px-4 w-full rounded focus:outline-none transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Full Width Bottom Buttons */}
                                <div className="mt-auto flex flex-col gap-1.5">
                                    <button 
                                        onClick={() => handleAttendees(event.id)} 
                                        className="bg-[#a0aec0] hover:bg-[#718096] active:bg-[#4a5568] text-white text-[12px] font-bold py-[6px] w-full rounded focus:outline-none transition-colors"
                                    >
                                        Attendees
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => navigate(`/admin-view-details/${event.id}`)}
                                        className="bg-[#1f2937] hover:bg-[#111827] active:bg-black text-white text-[12px] font-bold py-[6px] w-full rounded focus:outline-none transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
                            <p className="text-slate-500 text-sm max-w-xs text-center">Try adjusting your filters or search query to find what you're looking for.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setDateFilter(''); setCategoryFilter('All Categories'); setAppliedFilters({ date: '', category: 'All Categories' }); }}
                                className="mt-4 text-[#5CB85C] font-bold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminEvent;

