import React, { useState, useEffect } from 'react';
import { Bell, Calendar } from 'lucide-react';
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
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen relative">
            {/* Bell Icon in Top Right */}
            <div className="absolute top-8 right-8 lg:top-10 lg:right-12">
                <div className="relative">
                    <Bell className="w-6 h-6 text-[#5CB85C] cursor-pointer" />
                </div>
            </div>

            <div className="max-w-[700px] mx-auto mt-4">
                {/* Header */}
                <div className="mb-8 text-left">
                    <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-1">
                        Edit Speaker
                    </h1>
                    <p className="text-slate-400 font-medium text-base">
                        Share your event experience with the team.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Input 
                            id="name"
                            label="Speaker Name"
                            placeholder="Enter speaker name"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input 
                            id="category"
                            label="Category"
                            placeholder="Enter category"
                            fullWidth
                            required
                            value={formData.category}
                            onChange={handleChange}
                        />

                        <Input 
                            id="date"
                            label="DATE"
                            type="text"
                            placeholder="mm/dd/yyyy"
                            fullWidth
                            required
                            icon={Calendar}
                            value={formData.date}
                            onChange={handleChange}
                        />

                        <Input 
                            id="event"
                            label="Speaking at"
                            placeholder="Share your experience about this event..."
                            fullWidth
                            required
                            multiline
                            rows={3}
                            value={formData.event}
                            onChange={handleChange}
                        />

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full py-4 text-base font-extrabold rounded-2xl bg-[#5CB85C] border-none hover:bg-[#4AA14A] transition-colors" 
                            >
                                Edit a speaker
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSpeakersEdit;
