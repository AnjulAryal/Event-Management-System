import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import SpeakerCard from '../../components/ui/SpeakerCard';

const AdminSpeakers = () => {
    const navigate = useNavigate();
    const [speakers, setSpeakers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedSpeakers = JSON.parse(localStorage.getItem('speakers'));
        if (storedSpeakers && storedSpeakers.length > 0) {
            setSpeakers(storedSpeakers);
        } else {
            // Initial dummy speakers
            const dummySpeakers = [
                { id: "1", initials: "SC", name: "Sarah Chen", role: "UX Director, Google", category: "UI/UX Design", event: "Design Summit 2024", date: "Dec 01 - 02, 2024" },
                { id: "2", initials: "MR", name: "Marcus Rodriguez", role: "CTO, TechForward", category: "Technology", event: "Tech World 2024", date: "Nov 15 - 16, 2024" },
                { id: "3", initials: "AP", name: "Aisha Patel", role: "CEO, DesignCo", category: "Business", event: "Startup Expo 2024", date: "Oct 10 - 11, 2024" },
                { id: "4", initials: "JL", name: "James Liu", role: "Product Lead, Meta", category: "UI/UX Design", event: "UX Conf 2024", date: "Sep 22 - 23, 2024" },
                { id: "5", initials: "EW", name: "Emma Wilson", role: "Sustainability Expert", category: "Business", event: "Eco Summit 2024", date: "Aug 05 - 06, 2024" },
                { id: "6", initials: "DK", name: "David Kim", role: "AI Researcher, OpenAI", category: "Technology", event: "AI Workshop 2024", date: "Jul 18 - 19, 2024" }
            ];
            setSpeakers(dummySpeakers);
            localStorage.setItem('speakers', JSON.stringify(dummySpeakers));
        }
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin-speakers-edit/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this speaker?")) {
            const updated = speakers.filter(s => s.id !== id);
            setSpeakers(updated);
            localStorage.setItem('speakers', JSON.stringify(updated));
            toast.success("Speaker deleted successfully!");
        }
    };

    const filteredSpeakers = speakers.filter(speaker => 
        speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F7F9FB] font-sans text-slate-800 flex flex-col pb-12">
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
                            placeholder="Search speakers by name, role, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white focus:border-[#5CB85C] transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Empty placeholder for symmetry */}
                <div className="w-1/3"></div>
            </header>

            <div className="pt-8 px-6 lg:px-10 max-w-7xl mx-auto w-full">
                {/* Main Content Area */}
                <main>
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Speakers</h1>
                            <p className="text-slate-500 font-medium text-lg">Meet our world-class speakers</p>
                        </div>
                    </div>

                    {/* Speakers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {filteredSpeakers.map((speaker) => (
                            <SpeakerCard 
                                key={speaker.id} 
                                speaker={speaker} 
                                isAdmin={true}
                                onEdit={() => handleEdit(speaker.id)}
                                onDelete={() => handleDelete(speaker.id)}
                            />
                        ))}
                    </div>
                    {filteredSpeakers.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200">
                             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No speakers found</h3>
                            <p className="text-slate-500 max-w-xs text-center">We couldn't find any speakers matching "{searchQuery}".</p>
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-[#5CB85C] font-bold hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminSpeakers;

