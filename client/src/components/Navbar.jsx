import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Mic2,
    MessageSquare,
    HelpCircle,
    LogOut,
    Menu,
    X,
    ArrowRight,
} from "lucide-react";
import BrandLogo from "./ui/BrandLogo";

/**
 * Sidebar component - Specific for Eventify Admin and User dashboards.
 * Uses the same consistent design for both, with extra items for Admin.
 */
const Sidebar = ({ open, setOpen, isMobile }) => {
    const location = useLocation();
    const [hovered, setHovered] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Get actual user data from localStorage with reactive state
    const [storedUser, setStoredUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});

    // Listen for profile updates from UserProfile page
    useEffect(() => {
        const handleUserUpdated = () => {
            setStoredUser(JSON.parse(localStorage.getItem('user')) || {});
        };
        window.addEventListener('userUpdated', handleUserUpdated);
        return () => window.removeEventListener('userUpdated', handleUserUpdated);
    }, []);

    // Fetch fresh profile from backend on mount to get latest profilePicture
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser?.token) return;
        fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if (data) {
                const updated = { ...currentUser, profilePicture: data.profilePicture, name: data.name, phone: data.phone };
                localStorage.setItem('user', JSON.stringify(updated));
                setStoredUser(updated);
            }
        })
        .catch(() => {}); // silently fail
    }, []);

    const userName = storedUser.name || "Guest User";
    const userRole = storedUser.isAdmin ? "admin" : "user";

    // Calculate initials if not present in the object
    const initials = storedUser.initials || userName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const SIDEBAR_W = 240;

    // Define navigation sets based on role
    const userNavItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { id: "events", label: "Events", icon: Calendar, path: "/" },
        { id: "speakers", label: "Speakers", icon: Mic2, path: "/speakers" },
        { id: "feedback", label: "Feedback", icon: MessageSquare, path: "/feedback" },
        { id: "help", label: "Help/Support", icon: HelpCircle, path: "/help" },
    ];

    const adminNavItems = [
        { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
        { id: "admin-events", label: "Events", icon: Calendar, path: "/admin-events" },
        { id: "admin-speakers", label: "Speakers", icon: Mic2, path: "/admin-speakers" },
        { id: "admin-feedback", label: "Feedback", icon: MessageSquare, path: "/admin-feedback" },
        { id: "admin-help", label: "Help/Support", icon: HelpCircle, path: "/admin-help" },
    ];

    // Quick Action links for Admins
    const quickActions = userRole === 'admin' ? [
        { id: "add-event", label: "Add a Event", path: "/admin-add-event" },
        { id: "register-user", label: "Register a user", path: "/signup" },
    ] : [];

    const activeNavItems = userRole === 'admin' ? adminNavItems : userNavItems;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            {/* Mobile backdrop overlay */}
            {isMobile && open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(2px)",
                        zIndex: 199,
                    }}
                />
            )}

            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    top: "14px",
                    left: open ? `${SIDEBAR_W - 52}px` : "14px",
                    zIndex: 300,
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: open ? "transparent" : "#fff",
                    border: open ? "none" : "1.5px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#1a1a2e",
                    boxShadow: open ? "none" : "0 2px 10px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                }}
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar panel */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: `${SIDEBAR_W}px`,
                    background: "#ffffff",
                    borderRight: "1px solid #f0f0f0",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 0 20px rgba(0,0,0,0.02)",
                    zIndex: 200,
                    transform: open ? "translateX(0)" : `translateX(-${SIDEBAR_W}px)`,
                    transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
                    overflow: "visible",
                }}
            >
                {/* Logo Section */}
                <div style={{ padding: "32px 24px 20px" }}>
                    <BrandLogo size="24px" />
                </div>

                {/* User Profile Card */}
                <div 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    style={{ position: "relative", padding: "10px 24px 30px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                >
                    <div style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "50%",
                        background: userRole === 'admin' ? "#D3A06E" : "linear-gradient(135deg, #5CB85C 0%, #4AA14A 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "16px",
                        overflow: "hidden"
                    }}>
                        {storedUser.profilePicture ? (
                            <img src={storedUser.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a2e" }}>
                            {userName}
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: userRole === 'admin' ? "#9ca3af" : "#5CB85C", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {userRole}
                        </div>
                    </div>

                    {/* Popover Menu */}
                    {showProfileMenu && (
                        <div style={{
                            position: "absolute",
                            left: "135px",
                            top: "0px",
                            zIndex: 1000,
                            display: "flex",
                            alignItems: "flex-start",
                            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                        }}>
                            {/* Black Curved Arrow */}
                            <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "21px", marginRight: "-1px", zIndex: 2 }}>
                                <path d="M22 0C10 0 0 10 0 16C0 22 10 32 22 32Z" fill="black"/>
                            </svg>
                            <div style={{
                                width: "180px",
                                background: "#F5EDE9",
                                border: "1px solid black",
                                borderRadius: "10px",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <Link to={userRole === 'admin' ? "/admin-profile" : "/profile"} style={{ textDecoration: 'none' }} onClick={() => setShowProfileMenu(false)}>
                                    <div style={{ padding: "14px 10px", background: "#8A99A8", borderBottom: "1px solid black", textAlign: "center", fontSize: "15px", fontWeight: "400", color: "black", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#7A8998"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#8A99A8"}>Profile</div>
                                </Link>
                                <div style={{ padding: "14px 10px", borderBottom: "1px solid black", textAlign: "center", fontSize: "15px", fontWeight: "400", color: "black", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e8dcd5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>Invite a Friend</div>
                                <div style={{ padding: "14px 10px", borderBottom: "1px solid black", textAlign: "center", fontSize: "15px", fontWeight: "400", color: "black", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e8dcd5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>Payment History</div>
                                <div style={{ padding: "14px 10px", textAlign: "center", fontSize: "15px", fontWeight: "400", color: "black", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e8dcd5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>Attended Events</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "0 12px" }}>
                    {activeNavItems.map(({ id, label, icon: Icon, path }) => {
                        const isActive = location.pathname === path;
                        const isHovered = hovered === id;

                        return (
                            <Link
                                key={id}
                                to={path}
                                onMouseEnter={() => setHovered(id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => { if (isMobile) setOpen(false); }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    textDecoration: "none",
                                    background: isActive ? "transparent" : (isHovered ? "#f9f9f9" : "transparent"),
                                    color: isActive ? "#5CB85C" : (isHovered ? "#1a1a2e" : "#6b7280"),
                                    fontSize: "15px",
                                    fontWeight: isActive ? 700 : 500,
                                    transition: "all 0.2s",
                                    position: "relative",
                                }}
                            >
                                {/* Green active indicator bar (from original user navbar) */}
                                {isActive && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "-12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: "4px",
                                            height: "60%",
                                            background: "#5CB85C",
                                            borderRadius: "0 4px 4px 0",
                                        }}
                                    />
                                )}

                                <Icon size={18} style={{ color: isActive ? "#5CB85C" : (isHovered ? "#5CB85C" : "#9ca3af") }} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}

                    {/* Quick Actions for Admin (Plus prefix) */}
                    {quickActions.length > 0 && (
                        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f5f5f5" }}>
                            {quickActions.map(({ id, label, path }) => (
                                <Link
                                    key={id}
                                    to={path}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        textDecoration: "none",
                                        color: "#6b7280",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#1a1a2e"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                                >
                                    <span style={{ marginRight: "10px", fontSize: "18px", color: "#9ca3af" }}>+</span>
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}
                </nav>

                {/* Logout */}
                <div style={{ padding: "20px 16px 24px" }}>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        style={{
                            width: "100%",
                            padding: "15px",
                            borderRadius: "15px",
                            border: "none",
                            background: "#5CB85C",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            boxShadow: "0 4px 15px rgba(92,184,92,0.3)",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#4AA14A"}
                        onMouseLeave={e => e.currentTarget.style.background = "#5CB85C"}
                    >
                        Logout <ArrowRight size={18} />
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
