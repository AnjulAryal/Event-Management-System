import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GenericCollectionPage from "../../components/user/GenericCollectionPage";
import EventCard from "../../components/ui/EventCard";

export default function RegisteredEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const currentUserId = user?._id ? String(user._id) : "";

    const isParticipantMatch = (participant) => {
        if (!participant || !currentUserId) return false;
        if (typeof participant === "string") return participant === currentUserId;
        if (typeof participant === "object") {
            if (participant._id) return String(participant._id) === currentUserId;
            if (participant.id) return String(participant.id) === currentUserId;
        }
        return String(participant) === currentUserId;
    };

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;

            const token = user.token;

            try {
                const res = await fetch("/api/events");
                const data = await res.json();

                const myEvents = data
                    .filter(
                        (event) =>
                            Array.isArray(event.registeredParticipants) &&
                            event.registeredParticipants.some(isParticipantMatch)
                    )
                    .map((event) => ({ ...event, id: event._id }));

                setEvents(myEvents);

                const recRes = await fetch(`/api/events/recommendations?userId=${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const recData = await recRes.json();
                setRecommendedEvents(recData.map((event) => ({ ...event, id: event._id })));
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
            renderRecommendedItem={(event) => (
                <EventCard
                    key={`recommended-${event.id}`}
                    event={event}
                    showButtons={true}
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
