import React, { useState, useEffect } from 'react';
import { Search, MapPin, CalendarDays, ChevronDown, ArrowRight, Edit, Trash2, SlidersHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import EventCard from '../../components/ui/EventCard';
import Badge from '../../components/ui/Badge';

const AdminEvent = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    // Initialize events from localStorage or dummy data
    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events'));
        if (storedEvents && storedEvents.length > 0) {
            setEvents(storedEvents);
        } else {
            // Generate dummy events
            const dummyEvents = [
                { id: "1", title: "UI/UX Design Summit", location: "Creative Hub, SF", date: "2024-12-01", category: "UI/UX DESIGN", categoryColor: "#3b99fc" },
                { id: "2", title: "Modern Art Gala", location: "Metropolitan Gallery, NY", date: "2024-11-15", category: "ARTS", categoryColor: "#82c653" },
                { id: "3", title: "Product Design Workshop", location: "Remote/Digital", date: "2024-11-02", category: "DESIGN", categoryColor: "#f59e0b" },
                { id: "4", title: "Startup Expo 2024", location: "Innovation Center", date: "2024-10-10", category: "BUSINESS", categoryColor: "#10b981" },
                { id: "5", title: "Tech World 2024", location: "Convention Center", date: "2024-11-15", category: "TECHNOLOGY", categoryColor: "#6366f1" }
            ];
            setEvents(dummyEvents);
            localStorage.setItem('events', JSON.stringify(dummyEvents));
        }
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            const updatedEvents = events.filter(e => e.id !== id);
            setEvents(updatedEvents);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            toast.success("Event deleted successfully!");
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin-edit-event/${id}`);
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             event.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDate = !dateFilter || event.date === dateFilter;
        
        const matchesCategory = categoryFilter === 'All' || 
                               event.category.toUpperCase() === categoryFilter.toUpperCase();

        return matchesSearch && matchesDate && matchesCategory;
    });

    const categories = ['All', 'UI/UX Design', 'Business', 'Arts', 'Design', 'Technology'];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 flex flex-col pb-12">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 w-full animate-in fade-in duration-500">
                <div className="w-1/3"></div>

                {/* Search Bar */}
                <div className="flex-1 max-w-xl flex justify-center">
                    <div className="relative w-full max-w-md group">
                        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-[#5CB85C] transition-colors">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search events by title or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white focus:border-[#5CB85C] transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <div className="w-1/3 flex justify-end">
                    <Button 
                        variant="primary" 
                        size="sm" 
                        icon={ArrowRight} 
                        iconPosition="right"
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Events</h1>
                    <Button 
                        variant="primary" 
                        className="px-6 py-2.5 shadow-green-500/10"
                        icon={Plus}
                        onClick={() => navigate('/admin-add-event')}
                    >
                        New Event
                    </Button>
                </div>


                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {filteredEvents.map((event) => (
                        <EventCard 
                            key={event.id} 
                            event={event}
                            showButtons={false}
                            customActions={
                                <div className="flex items-center justify-between gap-3">
                                    <Button 
                                        variant="secondary" 
                                        size="md" 
                                        className="flex-1 rounded-xl" 
                                        icon={Edit}
                                        onClick={() => handleEdit(event.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="md" 
                                        className="flex-1 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-50 transition-colors" 
                                        icon={Trash2}
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            }
                        />
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No matching events</h3>
                            <p className="text-slate-500 max-w-xs text-center">We couldn't find any events matching your search criteria. Try a different query.</p>
                            <button 
                                onClick={() => { setSearchQuery(''); setDateFilter(''); setCategoryFilter('All'); }}
                                className="mt-6 text-[#5CB85C] font-bold hover:underline"
                            >
                                View all events
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminEvent;

