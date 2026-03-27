import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, LogOut, Ticket, Compass, LayoutDashboard, CalendarDays, MicVocal, HandHelping } from 'lucide-react';
let isAdmin = true;
let user = false
const Navbar = () => {

    const isActive = (path) => location.pathname === path; // Replace with actual admin check logic
    const navLinkClass = (path) => `
        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive(path)
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
            : 'text-neutral-500 hover:bg-neutral-100 hover:text-primary-600'}
    `;

    return (
        <>
            {/* Mobile Top Bar */}
            <nav className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50 px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-primary-600 p-1.5 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-neutral-900">Eventify</span>
                </Link>

                <div className="flex items-center space-x-2">
                    <Link to="/my-events" className="p-2 text-neutral-500 hover:text-primary-600">
                        <CalendarDays className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="text-sm font-bold text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50">
                        Login
                    </Link>
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <nav className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 z-50 flex flex-col p-6 hidden md:flex">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-3 mb-10">
                    <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-600/20">
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                        Eventify
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex-grow space-y-2">
                    <>
                        <Link to="/dashboard" className={navLinkClass('/my-events')}>
                            <LayoutDashboard className={`w-5 h-5 ${isActive('/my-events') ? 'text-white' : 'text-neutral-400 group-hover:text-primary-600'}`} />
                            <span className="font-bold">Dashboard</span>
                        </Link>

                        <Link to="/my-events" className={navLinkClass('/my-events')}>
                            <CalendarDays className={`w-5 h-5 ${isActive('/my-events') ? 'text-white' : 'text-neutral-400 group-hover:text-primary-600'}`} />
                            <span className="font-bold">My Events</span>
                        </Link>

                        <Link to="/speakers" className={navLinkClass('/my-events')}>
                            <MicVocal className={`w-5 h-5 ${isActive('/my-events') ? 'text-white' : 'text-neutral-400 group-hover:text-primary-600'}`} />
                            <span className="font-bold">Speakers</span>
                        </Link>

                        {isAdmin && (
                            <Link to="/add" className={navLinkClass('/add')}>
                                <HandHelping className={`w-5 h-5 ${isActive('/add') ? 'text-white' : 'text-neutral-400 group-hover:text-primary-600'}`} />
                                <span className="font-bold">Help/support</span>
                            </Link>
                        )}
                    </>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto pt-6 border-t border-neutral-100 space-y-2">
                    {user ? (
                        <>
                            <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold truncate">{user.name || 'User'}</p>
                                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center space-x-3 text-red-500 hover:text-red-600 font-bold px-4 py-3 rounded-xl hover:bg-red-50 transition-all font-bold"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="space-y-2 px-2">
                            <Link
                                to="/login"
                                className="block w-full text-center text-neutral-600 hover:text-primary-600 font-bold py-3 rounded-xl hover:bg-neutral-50 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block w-full text-center bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 font-bold"
                            >
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;

