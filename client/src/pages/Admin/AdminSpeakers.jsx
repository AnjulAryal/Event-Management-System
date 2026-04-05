import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import SpeakerCard from '../../components/ui/SpeakerCard';

const AdminSpeakers = () => {
    // Generate speaker data
    const speakers = [
        { initials: "SC", name: "Sarah Chen", role: "UX Director, Google", category: "UI/UX Design", event: "Design Summit 2024", date: "Dec 01 - 02, 2024" },
        { initials: "MR", name: "Marcus Rodriguez", role: "CTO, TechForward", category: "Technology", event: "Tech World 2024", date: "Nov 15 - 16, 2024" },
        { initials: "AP", name: "Aisha Patel", role: "CEO, DesignCo", category: "Business", event: "Startup Expo 2024", date: "Oct 10 - 11, 2024" },
        { initials: "JL", name: "James Liu", role: "Product Lead, Meta", category: "UI/UX Design", event: "UX Conf 2024", date: "Sep 22 - 23, 2024" },
        { initials: "EW", name: "Emma Wilson", role: "Sustainability Expert", category: "Business", event: "Eco Summit 2024", date: "Aug 05 - 06, 2024" },
        { initials: "DK", name: "David Kim", role: "AI Researcher, OpenAI", category: "Technology", event: "AI Workshop 2024", date: "Jul 18 - 19, 2024" }
    ];

    return (
        <div className="min-h-screen bg-[#F7F9FB] font-sans text-slate-800 flex flex-col pb-12">

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
                            placeholder="Search speakers..."
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

            <div className="pt-8 px-6 lg:px-10 max-w-7xl mx-auto w-full">
                {/* Main Content Area */}
                <main>
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Speakers</h1>
                        <p className="text-slate-500 font-medium text-lg">Meet our world-class speakers</p>
                    </div>

                    {/* Speakers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {speakers.map((speaker, index) => (
                            <SpeakerCard 
                                key={index} 
                                speaker={speaker} 
                                isAdmin={true}
                                onEdit={() => console.log('Edit', speaker.name)}
                                onDelete={() => console.log('Delete', speaker.name)}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSpeakers;

