import React from 'react';
import { Filter, CalendarDays, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-800">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome back, <span className="text-green-500">Admin</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Here is the current state of your event ecosystem for the next 24 hours.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="secondary" icon={Filter}>
                        Filters
                    </Button>
                    <Button variant="secondary" icon={CalendarDays}>
                        This Month
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard label="Total Events" value="1,284" color="#5CB85C" />
                        <StatCard label="Active Attendees" value="18.5k" color="#5CB85C" />
                    </div>

                    {/* Today's Events */}
                    <div>
                        <div className="flex items-center space-x-4 mb-6">
                            <Badge variant="primary">Priority</Badge>
                            <h2 className="text-2xl font-bold text-slate-900">Today's Events</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Event Card 1 */}
                            <div className="bg-white p-5 rounded-[20px] shadow-sm flex flex-col sm:flex-row gap-6">
                                <div className="w-full sm:w-40 h-40 bg-[#c63636] rounded-xl flex-shrink-0"></div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <Badge variant="blue">10:00 AM</Badge>
                                            <div className="flex items-center text-slate-500 text-sm font-medium">
                                                <MapPin className="w-3.5 h-3.5 mr-1 text-[#c63636]" />
                                                Main Auditorium
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">DevCorps</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            A deep dive into modern DevOps practices, cloud deployment, and scalable system design for developers.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-green-500 font-semibold text-sm">+842 attending</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event Card 2 */}
                            <div className="bg-white p-5 rounded-[20px] shadow-sm flex flex-col sm:flex-row gap-6">
                                <div className="w-full sm:w-40 h-40 bg-[#c63636] rounded-xl flex-shrink-0"></div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <Badge variant="blue">06:00 PM</Badge>
                                            <div className="flex items-center text-slate-500 text-sm font-medium">
                                                <MapPin className="w-3.5 h-3.5 mr-1 text-[#c63636]" />
                                                Rooftop Terrace
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">After Hours Networking: Founders & VCs</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Casual networking event for series-A startups and private equity investors. Open bar and ho...
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-green-500 font-semibold text-sm">+124 attending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <h2 className="text-[22px] font-bold text-slate-900 mb-6 mt-2 xl:mt-0 xl:mb-6">Upcoming Events</h2>

                    <div className="space-y-4">
                        {/* Upcoming Event 1 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
                            <div className="bg-slate-50/80 p-3 rounded-xl flex flex-col items-center justify-center min-w-[64px]">
                                <span className="text-green-500 text-xs font-bold uppercase tracking-wider mb-0.5">Oct</span>
                                <span className="text-xl font-extrabold text-slate-900">24</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Modern Art Gala 2024</h4>
                                <p className="text-sm text-slate-500 mt-0.5">Metropolitan Gallery • 2.4k Attending</p>
                            </div>
                        </div>

                        {/* Upcoming Event 2 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
                            <div className="bg-slate-50/80 p-3 rounded-xl flex flex-col items-center justify-center min-w-[64px]">
                                <span className="text-green-500 text-xs font-bold uppercase tracking-wider mb-0.5">Oct</span>
                                <span className="text-xl font-extrabold text-slate-900">28</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Sustainability Expo</h4>
                                <p className="text-sm text-slate-500 mt-0.5">Green Hall • 1.1k Attending</p>
                            </div>
                        </div>

                        {/* Upcoming Event 3 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
                            <div className="bg-slate-50/80 p-3 rounded-xl flex flex-col items-center justify-center min-w-[64px]">
                                <span className="text-green-500 text-xs font-bold uppercase tracking-wider mb-0.5">Nov</span>
                                <span className="text-xl font-extrabold text-slate-900">02</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Product Design Workshop</h4>
                                <p className="text-sm text-slate-500 mt-0.5">Remote/Digital • 450 Attending</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

