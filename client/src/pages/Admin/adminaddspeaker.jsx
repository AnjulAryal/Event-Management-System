import React, { useState } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Adminaddspeaker = () => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        role: '',
        organization: '',
        topic: 'UI/UX Design',
        eventName: '',
        eventDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.fullName || !formData.role || !formData.organization) {
            toast.error("Please fill required fields (Name, Role, Organization)");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const newSpeaker = {
                name: formData.fullName,
                role: `${formData.role}, ${formData.organization}`,
                category: formData.topic,
                event: formData.eventName || 'TBA',
                date: formData.eventDate || new Date().toISOString().split('T')[0],
                initials: formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                profilePic: profilePic
            };

            const res = await fetch('/api/speakers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newSpeaker)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to add speaker');
            }

            toast.success("Speaker added successfully!");
            navigate('/admin-speakers');
        } catch (error) {
            console.error("Error adding speaker:", error);
            toast.error(error.message || "Failed to add speaker");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans pb-12 flex flex-col">
            {/* Top Navigation Bar / Search Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-center sticky top-0 z-10 w-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="relative w-full max-w-lg group">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                        <Search className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search speakers, events, or analytics..."
                        className="w-full bg-[#f4f6f8] border-none text-[13px] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#f4f6f8] focus:bg-white transition-all"
                    />
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-8">
                {/* Breadcrumbs */}
                <div className="text-[13px] font-bold text-slate-500 mb-8">
                    Speakers <span className="mx-1.5 font-normal text-slate-300">›</span> <span className="text-slate-800">Add Speaker</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                    {/* Left Column - Forms */}
                    <div className="bg-white rounded-[32px] p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-50">
                        
                        {/* Section 1: Professional Identity */}
                        <div className="mb-10">
                            <h2 className="text-[22px] font-bold text-slate-900 mb-1.5">Professional Identity</h2>
                            <p className="text-[14px] text-slate-500 mb-8">Enter the speaker's core information for the event listing.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        placeholder="e.g. Dr. Sarah Jenkins"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-[#f4f6f8] text-slate-800 text-[14px] rounded-2xl p-4 outline-none focus:bg-slate-100 transition-colors placeholder-[#9ca3af]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5">Role / Title</label>
                                    <input 
                                        type="text" 
                                        name="role"
                                        placeholder="e.g. Senior Creative Director"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-[#f4f6f8] text-slate-800 text-[14px] rounded-2xl p-4 outline-none focus:bg-slate-100 transition-colors placeholder-[#9ca3af]"
                                    />
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5">Organisation</label>
                                <input 
                                    type="text" 
                                    name="organization"
                                    placeholder="e.g. Quantum Design Lab"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="w-full bg-[#f4f6f8] text-slate-800 text-[14px] rounded-2xl p-4 outline-none focus:bg-slate-100 transition-colors placeholder-[#9ca3af]"
                                />
                            </div>

                            <div className="mb-5 relative">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5">Topic / Tag</label>
                                <div className="relative">
                                    <select 
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        className="w-full bg-[#f4f6f8] text-slate-800 text-[14px] rounded-2xl p-4 appearance-none outline-none focus:bg-slate-100 cursor-pointer pr-10 hover:bg-slate-100 transition-colors"
                                    >
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Business">Business</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                    <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full border-t border-dashed border-slate-200 mb-10"></div>

                        {/* Section 2: Event Association */}
                        <div className="mb-8">
                            <h2 className="text-[22px] font-bold text-slate-900 mb-8">Event Association</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5">Event Name</label>
                                    <input 
                                        type="text" 
                                        name="eventName"
                                        placeholder="e.g. Design Kinetic 2024"
                                        value={formData.eventName}
                                        onChange={handleChange}
                                        className="w-full bg-[#f4f6f8] text-slate-800 text-[14px] rounded-2xl p-4 outline-none focus:bg-slate-100 transition-colors placeholder-[#9ca3af]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2.5">Event Date</label>
                                    <div className="relative">
                                        <input 
                                            type="date" 
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                            className="w-full bg-[#f4f6f8] text-slate-800 text-[14px] rounded-2xl p-4 outline-none focus:bg-slate-100 transition-colors pr-12 appearance-none placeholder-[#9ca3af]"
                                            style={{ color: formData.eventDate ? 'inherit' : '#9ca3af' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-start sm:justify-start gap-4 mt-12 w-full max-w-[400px] ml-auto">
                            <button 
                                onClick={() => navigate('/admin-speakers')}
                                className="flex-1 py-4 rounded-[12px] text-[15px] font-bold text-slate-800 bg-white border border-slate-700 hover:bg-slate-50 transition-colors outline-none"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 py-4 rounded-[12px] text-[15px] font-bold text-white bg-[#5CB85C] hover:bg-green-600 shadow-[0_2px_10px_rgba(92,184,92,0.2)] transition-colors outline-none"
                            >
                                Save Speaker
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Profile Picture */}
                    <div>
                        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[24px] p-10 flex flex-col items-center justify-center py-20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] relative">
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                id="speaker-image" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            
                            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center mb-6 overflow-hidden shadow-inner relative bg-[#b1b9c2]">
                                {profilePic ? (
                                    <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute bottom-[-15px] w-14 h-16 bg-[#ebedf0] rounded-[50%_50%_0_0/50%_50%_0_0] flex items-center justify-center">
                                        <div className="w-6 h-8 bg-[#ebedf0] rounded-full absolute -top-8"></div>
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-slate-800 text-[15px] mb-2.5">Profile Picture</h3>
                            <p className="text-[12.5px] text-slate-400 text-center mb-6 max-w-[160px] leading-relaxed">
                                Drag and drop or click to upload. Max size 5MB.
                            </p>
                            
                            <label 
                                htmlFor="speaker-image" 
                                className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-[#5CB85C] bg-white border border-[#b8e8b8] hover:bg-[#f2fbf2] transition-colors cursor-pointer outline-none inline-block"
                            >
                                Choose File
                            </label>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Adminaddspeaker;
