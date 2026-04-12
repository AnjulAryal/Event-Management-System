import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminSpeakersEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        category: '',
        event: '',
        date: '',
        initials: ''
    });

    useEffect(() => {
        const fetchSpeaker = async () => {
            try {
                const res = await fetch(`/api/speakers/${id}`);
                if (!res.ok) throw new Error('Speaker not found');
                const speakerToEdit = await res.json();
                
                if (speakerToEdit.profilePic) {
                    setProfilePic(speakerToEdit.profilePic);
                }
                
                setFormData({
                    name: speakerToEdit.name || '',
                    role: speakerToEdit.role || '',
                    category: speakerToEdit.category || '',
                    event: speakerToEdit.event || '',
                    date: speakerToEdit.date || '',
                    initials: speakerToEdit.initials || ''
                });
            } catch (error) {
                console.error("Error fetching speaker:", error);
                toast.error("Speaker not found!");
                navigate('/admin-speakers');
            }
        };

        fetchSpeaker();
    }, [id, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const res = await fetch(`/api/speakers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, profilePic })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update speaker');
            }

            toast.success("Speaker information updated!");
            navigate('/admin-speakers');
        } catch (error) {
            console.error("Error updating speaker:", error);
            toast.error(error.message || "Failed to update speaker");
        }
    };

    return (
        <div className="flex-1 w-full bg-[#f8fafc] p-6 lg:p-10 font-sans min-h-screen relative">


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
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50 relative">
                            <input 
                                type="file" 
                                id="speaker-edit-image"
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            
                            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-inner relative bg-[#b1b9c2]">
                                {profilePic ? (
                                    <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="font-bold text-white text-3xl">{formData.initials || 'U'}</div>
                                )}
                            </div>
                            
                            <label 
                                htmlFor="speaker-edit-image" 
                                className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-[#5CB85C] bg-white border border-[#b8e8b8] hover:bg-[#f2fbf2] transition-colors cursor-pointer outline-none inline-block shadow-sm"
                            >
                                Change Picture
                            </label>
                        </div>
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
