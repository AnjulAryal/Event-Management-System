import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GenericCollectionPage from "../../components/user/GenericCollectionPage";
import EventCard from "../../components/ui/EventCard";
import Button from "../../components/ui/Button";

const MY_EVENTS = [
    // ... same as before
    { id: 1, title: "UI/UX Design Summit", location: "Creative Hub, NYC", date: "Dec 01, 2024", category: "UI/UX DESIGN", categoryColor: "#6c8ebf" },
    { id: 2, title: "DevCorps 2024", location: "Main Auditorium", date: "Oct 28, 2024", category: "TECHNOLOGY", categoryColor: "#c97b7b" },
    { id: 3, title: "Modern Art Gala", location: "Metropolitan Gallery", date: "Oct 24, 2024", category: "ART", categoryColor: "#8b8b6e" },
    { id: 4, title: "Sustainability Expo", location: "Green Hall", date: "Nov 02, 2024", category: "BUSINESS", categoryColor: "#7b9e87" },
    { id: 5, title: "Startup Launchpad", location: "Innovation Hub", date: "Nov 15, 2024", category: "BUSINESS", categoryColor: "#7b9e87" },
    { id: 6, title: "Yoga Flow Intensive", location: "Wellness Center", date: "Nov 20, 2024", category: "HEALTH", categoryColor: "#8b8b6e" },
];

export default function RegisteredEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;
            const token = user.token;
            try {
                // Fetch my events
                const res = await fetch('/api/events');
                const data = await res.json();
                const myEvents = data
                    .filter(e => e.registeredParticipants && e.registeredParticipants.includes(user._id))
                    .map(e => ({ ...e, id: e._id }));
                setEvents(myEvents);

                // Fetch real recommendations from backend
                const recRes = await fetch(`/api/events/recommendations?userId=${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const recData = await recRes.json();
                setRecommendedEvents(recData.map(e => ({ ...e, id: e._id })));

            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [user?._id]);

    const ViewAllLink = () => (
        <Link to="/all-events" className="text-[#5CB85C] text-sm font-bold flex items-center gap-1 hover:underline group">
            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
    );

    return (
        <GenericCollectionPage
            title="My Events"
            subtitle={loading ? "Fetching your bookings..." : `You have ${events.length} registered events`}
            items={events}
            recommendedItems={recommendedEvents}
            categories={["UI/UX DESIGN", "TECHNOLOGY", "ART", "BUSINESS", "HEALTH"]}
            searchPlaceholder="Search events..."
            rightElement={<ViewAllLink />}
            renderItem={(event) => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    showButtons={true}
                    customActions={
                        <div className="space-y-3">
                            <button className="w-full bg-[#5CB85C] text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98]">
                                Registered
                            </button>
                            <button 
                                onClick={() => navigate(`/event-details/${event.id}`)}
                                className="w-full bg-[#F3F6F9] hover:bg-[#E8EDF2] text-[#5E718D] py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
                            >
                                View Details
                            </button>
                        </div>
                    }
                />
            )}
            emptyState={{
                icon: loading ? "⏳" : "📅",
                title: loading ? "Loading..." : "No events found",
                description: loading ? "Please wait while we fetch your data." : "You haven't registered for any events yet."
            }}
        />
    );
}
