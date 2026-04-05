import React, { useState, useEffect } from 'react';
import { Mic2, Tag, Calendar, MapPin, ArrowRight, X, User, Briefcase } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminSpeakersEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        category: '',
        event: '',
        date: '',
        initials: ''
    });

    useEffect(() => {
        const speakers = JSON.parse(localStorage.getItem('speakers')) || [];
        const speakerToEdit = speakers.find(s => s.id === id);
        if (speakerToEdit) {
            setFormData({
                name: speakerToEdit.name || '',
                role: speakerToEdit.role || '',
                category: speakerToEdit.category || '',
                event: speakerToEdit.event || '',
                date: speakerToEdit.date || '',
                initials: speakerToEdit.initials || ''
            });
        } else {
            toast.error("Speaker not found!");
            navigate('/admin-speakers');
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { id, name, value } = e.target;
        const field = id || name;
        
        let newInitials = formData.initials;
        if (field === 'name') {
            newInitials = value.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }

        setFormData(prev => ({ 
            ...prev, 
            [field]: value,
            initials: field === 'name' ? newInitials : prev.initials
        }));
    };

    const handleCancel = () => {
        navigate('/admin-speakers');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const speakers = JSON.parse(localStorage.getItem('speakers')) || [];
        const updatedSpeakers = speakers.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    ...formData
                };
            }
            return s;
        });

        localStorage.setItem('speakers', JSON.stringify(updatedSpeakers));
        toast.success("Speaker information updated!");
        navigate('/admin-speakers');
    };

    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen">
            <div className="max-w-[1000px] mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-2">
                        Edit <span className="text-[#5CB85C]">Speaker</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                        Update the profile and appearance details for this speaker.
                    </p>
                </div>

                {/* Content Layout */}
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column (Wider) */}
                    <div className="flex-1 space-y-8">

                        {/* Box 1: Speaker Profile */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#5CB85C]" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Personal Profile
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Input 
                                    id="name"
                                    label="Full Name"
                                    placeholder="e.g. Sarah Chen"
                                    fullWidth
                                    required
                                    icon={User}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <Input 
                                    id="role"
                                    label="Professional Role"
                                    placeholder="e.g. UX Director, Google"
                                    fullWidth
                                    required
                                    icon={Briefcase}
                                    value={formData.role}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Box 2: Category & Category Info */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-[#5CB85C]" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Classification
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Input 
                                    id="category"
                                    label="Speaker Category"
                                    placeholder="e.g. UI/UX Design"
                                    fullWidth
                                    required
                                    icon={Tag}
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Box 3: Event Association */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-[#5CB85C]" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Event Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input 
                                    id="event"
                                    label="Speaking At"
                                    placeholder="Event Title"
                                    fullWidth
                                    required
                                    icon={Mic2}
                                    value={formData.event}
                                    onChange={handleChange}
                                />
                                <Input 
                                    id="date"
                                    label="Appearance Date"
                                    placeholder="e.g. Dec 01, 2024"
                                    fullWidth
                                    required
                                    icon={Calendar}
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Narrower Sidebar) */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-8">
                        {/* Box 4: Preview Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center">
                            <label className="w-full text-[10px] font-extrabold text-[#5CB85C] uppercase tracking-widest mb-6 block">
                                Profile Avatar Preview
                            </label>
                            
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#5CB85C] to-[#4AA14A] flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-xl shadow-green-500/20">
                                {formData.initials || '?'}
                            </div>
                            
                            <div className="text-center space-y-1">
                                <h4 className="font-bold text-slate-900 text-xl">{formData.name || 'New Speaker'}</h4>
                                <p className="text-slate-500 text-sm font-medium">{formData.role || 'Professional Role'}</p>
                            </div>
                        </div>

                        {/* Box 5: Actions */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col gap-4">
                            <Button 
                                type="submit" 
                                className="w-full py-4 text-base" 
                                icon={ArrowRight}
                                iconPosition="right"
                            >
                                Update Profile
                            </Button>
                            <Button 
                                type="button" 
                                variant="secondary" 
                                className="w-full py-4 text-base" 
                                icon={X}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSpeakersEdit;
