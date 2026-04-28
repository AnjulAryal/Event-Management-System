import React, { useState, useEffect } from 'react';
import { CloudUpload, MapPin, ArrowRight, X, Users } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminAddEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        location: '',
        organizer: '',
        adminNotes: '',
        category: 'technology',
        coverImage: '',
        speakers: []
    });
    const [allSpeakers, setAllSpeakers] = useState([]);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const res = await fetch('/api/speakers');
                const data = await res.json();
                setAllSpeakers(data);
            } catch (error) {
                console.error("Error fetching speakers:", error);
            }
        };
        fetchSpeakers();
    }, []);

    const handleSpeakerToggle = (speakerId) => {
        setFormData(prev => {
            const speakers = prev.speakers.includes(speakerId)
                ? prev.speakers.filter(id => id !== speakerId)
                : [...prev.speakers, speakerId];
            return { ...prev, speakers };
        });
    };


    const handleChange = (e) => {
        const { id, name, value } = e.target;
        const field = id || name;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        navigate('/admin-events');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        const newEvent = {
            ...formData,
            categoryColor: formData.category === 'technology' ? '#3b99fc' : '#82c653'
        };

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: user && user.token ? `Bearer ${user.token}` : ''
                },
                body: JSON.stringify(newEvent)
            });

            if (!res.ok) throw new Error('Failed to create event');
            
            toast.success("Event created successfully!");
            navigate('/admin-events');
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("Failed to create event. Please try again.");
        }
    };

    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen">
            <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Create New Event</h1>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl">
                            Fill in the details below to launch your next masterpiece.
                        </p>
                    </div>
                </div>

                {/* Content Layout */}
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column (Wider) */}
                    <div className="flex-1 space-y-8">

                        {/* Box 1: Core Details */}
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100 space-y-6">
                            <Input 
                                id="title"
                                label="Event Title"
                                placeholder="e.g. Global Tech Summit 2024"
                                fullWidth
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <Input 
                                id="description"
                                label="Description"
                                placeholder="Describe the soul of this event..."
                                multiline
                                rows={5}
                                fullWidth
                                required
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Box 2: Logistics & Venue */}
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center mb-8">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mr-3">
                                    <MapPin className="w-5 h-5 text-[#5CB85C]" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Logistics & Venue
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input id="date" label="Date" type="date" required value={formData.date} onChange={handleChange} />
                                <Input id="time" label="Time" type="time" required value={formData.time} onChange={handleChange} />
                                <Input id="venue" label="Venue Name" placeholder="The Grand Hall" required value={formData.venue} onChange={handleChange} />
                                <Input id="location" label="City / Location" placeholder="San Francisco, CA" required value={formData.location} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Box 3: Additional Details */}
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input id="organizer" label="Organizer" placeholder="Department of Innovation" value={formData.organizer} onChange={handleChange} />
                                <Input id="adminNotes" label="Admin Notes (Private)" placeholder="Internal billing reference..." value={formData.adminNotes} onChange={handleChange} />
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Narrower Sidebar) */}
                    <div className="w-full lg:w-[360px] shrink-0 space-y-8">

                        {/* Box 4: Event Cover Image */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
                            <label className="text-[10px] font-extrabold text-[#5CB85C] uppercase tracking-widest ml-1">
                                Event Cover Image
                            </label>
                            <label className="aspect-[4/3] w-full border-2 border-dashed border-slate-100 rounded-[28px] flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-green-50/30 transition-all cursor-pointer group">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // 5MB Limit Validation
                                            if (file.size > 5 * 1024 * 1024) {
                                                toast.error("Image is too large! Please upload a file smaller than 5MB.");
                                                e.target.value = null;
                                                return;
                                            }
                                            
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, coverImage: reader.result }));
                                                toast.success("Image uploaded and ready for display!");
                                            };
                                            reader.onerror = () => {
                                                toast.error("Failed to read image file.");
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {formData.coverImage ? (
                                    <div className="w-full h-full relative group/img overflow-hidden rounded-[20px]">
                                        <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <p className="text-white font-bold text-sm text-center">Click to change<br/>Upload</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <CloudUpload className="w-6 h-6 text-[#5CB85C]" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 text-center mb-2">
                                            Click to upload
                                        </p>
                                        <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
                                            PNG, JPG or WEBP (Max 5MB)<br />
                                            1600 × 900px recommended
                                        </p>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* Box 5: Category & Actions */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-extrabold text-[#5CB85C] uppercase tracking-widest ml-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm py-4 px-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white focus:border-green-500 transition-all appearance-none font-bold cursor-pointer"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="technology">Technology & Innovation</option>
                                    <option value="business">Business & Finance</option>
                                    <option value="arts">Arts & Culture</option>
                                    <option value="health">Health & Wellness</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-extrabold text-[#5CB85C] uppercase tracking-widest ml-1">
                                    Speakers
                                </label>
                                <div className="max-h-48 overflow-y-auto space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    {allSpeakers.length > 0 ? allSpeakers.map(speaker => (
                                        <label key={speaker._id} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.speakers.includes(speaker._id)}
                                                onChange={() => handleSpeakerToggle(speaker._id)}
                                                className="w-4 h-4 rounded text-[#5CB85C] focus:ring-[#5CB85C] border-slate-300"
                                            />
                                            <span className="text-sm font-bold text-slate-700 group-hover:text-[#5CB85C] transition-colors">
                                                {speaker.name}
                                            </span>
                                        </label>
                                    )) : (
                                        <p className="text-xs text-slate-400 font-bold text-center py-2">No speakers found</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-4">

                                <Button 
                                    type="submit" 
                                    className="py-4 text-base" 
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    Create Event
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="py-4 text-base" 
                                    icon={X}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddEvent;
