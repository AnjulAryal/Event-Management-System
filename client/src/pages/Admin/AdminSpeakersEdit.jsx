import React from 'react';
import { Calendar, Mic2, Tag, MapPin, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminSpeakersEdit = () => {
    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 p-8 md:p-12 flex flex-col items-start w-full">

            <div className="w-full max-w-2xl mx-auto md:mx-0 animate-in fade-in slide-in-from-left-4 duration-500">
                {/* Header */}
                <div className="mb-10 pl-1">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Edit Speaker</h1>
                    <p className="text-slate-500 font-medium text-lg">Update speaker details and session information.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-100 w-full space-y-8">

                    <div className="space-y-6">
                        {/* Speaker Name Field */}
                        <Input 
                            label="Speaker Name"
                            name="name"
                            placeholder="e.g. Sarayu Gautam"
                            icon={Mic2}
                        />

                        {/* Category Field */}
                        <Input 
                            label="Category"
                            name="category"
                            placeholder="e.g. UI/UX Design"
                            icon={Tag}
                        />

                        {/* Date Field */}
                        <Input 
                            label="Event Date"
                            type="date"
                            name="date"
                            icon={Calendar}
                        />

                        {/* Speaking At Field */}
                        <Input 
                            label="Speaking At"
                            name="event"
                            placeholder="Event Title"
                            icon={MapPin}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button 
                            fullWidth 
                            className="py-4 text-base"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Update Speaker Information
                        </Button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminSpeakersEdit;

