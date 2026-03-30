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
} from "lucide-react";

const user = {
    name: "Anjul Aryal",
    role: "Orchestrator Role",
    initials: "AA",
};

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "events", label: "Events", icon: Calendar, path: "/" },
    { id: "speakers", label: "Speakers", icon: Mic2, path: "/speakers" },
    { id: "feedback", label: "Feedback", icon: MessageSquare, path: "/feedback" },
    { id: "help", label: "Help/Support", icon: HelpCircle, path: "/help", accent: true },
];

export default function Sidebar() {
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [hovered, setHovered] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setOpen(!mobile);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const SIDEBAR_W = 240;

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
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

            {/* Hamburger / close toggle button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    top: "14px",
                    left: open && !isMobile ? `${SIDEBAR_W + 14}px` : "14px",
                    zIndex: 300,
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#fff",
                    border: "1.5px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#1a1a2e",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    transition: "left 0.3s cubic-bezier(.4,0,.2,1), background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0f0f0")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
                {open ? <X size={18} /> : <Menu size={18} />}
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
                    borderRight: "1.5px solid #f0f0f0",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
                    zIndex: 200,
                    transform: open ? "translateX(0)" : `translateX(-${SIDEBAR_W}px)`,
                    transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
                    overflow: "hidden",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: "26px 22px 20px",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #f5f5f5",
                    }}
                >
                    <span style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                        <span style={{ color: "#3cb95e" }}>EVENT</span>
                        <span style={{ color: "#1a1a2e" }}>IFY</span>
                    </span>
                </div>

                {/* User profile card */}
                <div
                    style={{
                        margin: "16px 12px",
                        background: "#f7fdf9",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #3cb95e 0%, #27a04a 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "13px",
                            flexShrink: 0,
                            boxShadow: "0 2px 8px rgba(60,185,94,0.3)",
                        }}
                    >
                        {user.initials}
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#1a1a2e",
                                lineHeight: 1.3,
                            }}
                        >
                            {user.name}
                        </div>
                        <div
                            style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "#3cb95e",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                marginTop: "2px",
                            }}
                        >
                            {user.role}
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav
                    style={{
                        flex: 1,
                        padding: "4px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        overflowY: "auto",
                    }}
                >
                    {navItems.map(({ id, label, icon: Icon, accent, path }) => {
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
                                    gap: "11px",
                                    padding: "11px 14px",
                                    borderRadius: "10px",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    background: isActive
                                        ? "#1a1a2e"
                                        : isHovered
                                            ? "#f5f5f7"
                                            : "transparent",
                                    color: isActive
                                        ? "#ffffff"
                                        : accent
                                            ? "#e53935"
                                            : isHovered
                                                ? "#1a1a2e"
                                                : "#6b7280",
                                    fontFamily: "inherit",
                                    fontSize: "13.5px",
                                    fontWeight: isActive ? 600 : 500,
                                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                                    transform: isHovered && !isActive ? "translateX(3px)" : "none",
                                    position: "relative",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {/* Green active indicator bar */}
                                {isActive && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: "3px",
                                            height: "55%",
                                            background: "#3cb95e",
                                            borderRadius: "0 3px 3px 0",
                                        }}
                                    />
                                )}

                                <Icon
                                    size={18}
                                    style={{
                                        flexShrink: 0,
                                        color: isActive
                                            ? "#3cb95e"
                                            : accent
                                                ? "#e53935"
                                                : isHovered
                                                    ? "#3cb95e"
                                                    : "#9ca3af",
                                        transition: "color 0.18s",
                                    }}
                                />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: "16px 12px" }}>
                    <button
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "#27a04a";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(60,185,94,0.4)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "#3cb95e";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(60,185,94,0.3)";
                        }}
                        style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#3cb95e",
                            color: "#fff",
                            fontFamily: "inherit",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                            boxShadow: "0 4px 14px rgba(60,185,94,0.3)",
                        }}
                    >
                        <LogOut size={16} />
                        <span>Logout →</span>
                    </button>
                </div>
            </aside>
        </div>
    );
}