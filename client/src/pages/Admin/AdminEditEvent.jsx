import React, { useState, useEffect } from 'react';
import { CloudUpload, MapPin, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminEditEvent = () => {
    const { id } = useParams();
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
        category: 'technology'
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (!res.ok) throw new Error('Event not found');
                const eventToEdit = await res.json();
                setFormData({
                    title: eventToEdit.title || '',
                    description: eventToEdit.description || '',
                    date: eventToEdit.date || '',
                    time: eventToEdit.time || '',
                    venue: eventToEdit.venue || '',
                    location: eventToEdit.location || '',
                    organizer: eventToEdit.organizer || '',
                    adminNotes: eventToEdit.adminNotes || '',
                    category: eventToEdit.category || 'technology'
                });
            } catch (err) {
                console.error(err);
                toast.error("Event not found!");
                navigate('/admin-events');
            }
        };
        fetchEvent();
    }, [id, navigate]);

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
        
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            
            const payload = {
                ...formData,
                categoryColor: formData.category === 'technology' ? '#3b99fc' : '#82c653'
            };

            const res = await fetch(`/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: user && user.token ? `Bearer ${user.token}` : ''
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update event');
            }

            toast.success("Event updated successfully!");
            navigate('/admin-events');
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error(error.message || "Failed to update event");
        }
    };

    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight mb-2">
                        Edit <span className="text-[#5CB85C]">Event</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[15px] max-w-2xl leading-relaxed">
                        Update the details below to refine your event experience.
                    </p>
                </div>

                {/* Content Layout */}
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Column (Wider) */}
                    <div className="flex-1 space-y-6">

                        {/* Box 1: Core Details */}
                        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100 space-y-6">
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
                                rows={4}
                                fullWidth
                                required
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Box 2: Logistics & Venue */}
                        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                                    <MapPin className="w-4 h-4 text-[#5CB85C]" />
                                </div>
                                <h3 className="text-[11px] font-bold text-[#5CB85C] uppercase tracking-widest">
                                    LOGISTICS & VENUE
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input id="date" label="Date" type="date" required value={formData.date} onChange={handleChange} />
                                <Input id="time" label="Time" type="time" required value={formData.time} onChange={handleChange} />
                                <Input id="venue" label="Venue Name" placeholder="The Grand Hall" required value={formData.venue} onChange={handleChange} />
                                <Input id="location" label="City / Location" placeholder="San Francisco, CA" required value={formData.location} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Box 3: Additional Details */}
                        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input id="organizer" label="Organizer" placeholder="Department of Innovation" value={formData.organizer} onChange={handleChange} />
                                <Input id="adminNotes" label="Admin Notes (Private)" placeholder="Internal billing reference..." value={formData.adminNotes} onChange={handleChange} />
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Narrower Sidebar) */}
                    <div className="w-full lg:w-[340px] shrink-0 space-y-6">

                        {/* Box 4: Event Cover Image */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col h-[320px]">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4 shrink-0">
                                EVENT COVER IMAGE
                            </label>
                            <label className="flex-1 w-full border-2 border-dashed border-slate-200/80 rounded-[24px] flex flex-col items-center justify-center p-6 bg-white hover:bg-[#f8fafc]/50 transition-colors cursor-pointer group relative overflow-hidden">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                                toast.error("Image is too large! Please upload a file smaller than 5MB.");
                                                e.target.value = null;
                                                return;
                                            }

                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, coverImage: reader.result }));
                                                toast.success("Image updated and ready for display!");
                                            };
                                            reader.onerror = () => {
                                                toast.error("Failed to read image file.");
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {formData.coverImage ? (
                                    <>
                                        <img src={formData.coverImage.startsWith('data:image') || formData.coverImage.startsWith('http') ? formData.coverImage : `http://localhost:5000${formData.coverImage}`} className="w-full h-full object-cover absolute inset-0" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 w-full h-full">
                                            <p className="text-white font-bold text-sm text-center">Click to change<br/>Upload</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-[52px] h-[52px] rounded-full bg-[#f4f6f8] flex items-center justify-center mb-4 group-hover:bg-[#eaf1ec] transition-colors">
                                            <CloudUpload className="w-[22px] h-[22px] text-[#5CB85C]" strokeWidth={2.5} />
                                        </div>
                                        <p className="text-[13px] font-bold text-[#1f2937] text-center mb-3">
                                            Click to upload or<br />drag and drop
                                        </p>
                                        <div className="text-[10px] text-slate-400 text-center leading-[1.6]">
                                            <p>PNG, JPG or WEBP (Max 5MB)</p>
                                            <p>Recommended: 1600×900px</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* Box 5: Category & Actions */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                            <div className="mb-6">
                                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-3">
                                    CATEGORY
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        className="block w-full bg-[#f4f6f8] text-slate-700 text-sm py-3.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/30 transition-all border-none appearance-none font-medium cursor-pointer"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="technology">Technology & Innovation</option>
                                        <option value="business">Business & Finance</option>
                                        <option value="arts">Arts & Culture</option>
                                        <option value="health">Health & Wellness</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button 
                                    type="submit" 
                                    className="w-full py-4" 
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    Update Event
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="w-full py-3.5" 
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

export default AdminEditEvent;
