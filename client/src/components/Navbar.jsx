import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Calendar,
    LogOut,
    CalendarDays,
    MicVocal,
    LayoutDashboard,
    HandHelping,
    Menu,
    X,
} from 'lucide-react';

// Dummy state
let isAdmin = true;
let user = false;

// Nav config
const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/my-events', label: 'My Events', icon: CalendarDays },
    { path: '/speakers', label: 'Speakers', icon: MicVocal },
    { path: '/help', label: 'Help/support', icon: HandHelping, adminOnly: true },
];

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    // Class for link
    const navLinkClass = (path) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive(path)
            ? 'bg-primary-600 text-black'
            : 'text-neutral-500 hover:bg-neutral-100 hover:text-primary-600'
        }`;

    const iconClass = (path) =>
        `w-5 h-5 ${isActive(path) ? 'text-black' : 'text-neutral-400 group-hover:text-primary-600'
        }`;

    const textClass = (path) => (isActive(path) ? 'text-black font-bold' : 'font-bold');

    return (
        <>
            {/* Mobile Top Bar */}
            <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 h-16 flex items-center justify-between">
                <button onClick={() => setIsOpen(true)}>
                    <Menu className="w-6 h-6 text-neutral-700" />
                </button>

                <Link to="/" className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="font-bold">Eventify</span>
                </Link>

                <div />
            </nav>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {navItems.map((item) => {
                        if (item.adminOnly && !isAdmin) return null;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={navLinkClass(item.path)}
                            >
                                <Icon className={iconClass(item.path)} />
                                <span className={textClass(item.path)}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <nav className="fixed left-0 top-0 h-screen w-64 bg-white border-r z-50 hidden md:flex flex-col p-6">
                <Link to="/" className="flex items-center space-x-2 mb-10">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="text-xl font-bold">Eventify</span>
                </Link>

                <div className="flex-grow space-y-2">
                    {navItems.map((item) => {
                        if (item.adminOnly && !isAdmin) return null;
                        const Icon = item.icon;

                        return (
                            <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                                <Icon className={iconClass(item.path)} />
                                <span className={textClass(item.path)}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-4 border-t">
                    {user ? (
                        <button className="flex items-center space-x-2 text-red-500">
                            <LogOut />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <Link to="/login" className="text-primary-600 font-bold">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;