import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import GenericCollectionPage from "../../components/user/GenericCollectionPage";
import SpeakerCard from "../../components/ui/SpeakerCard";
import { getErrorMessage, parseJsonSafe } from "../../utils/safeJson";
import { getNextUpcomingEventForSpeaker } from "../../utils/speakerEvents";

export default function Speakers() {
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const [speakerRes, eventRes] = await Promise.all([
                    fetch('/api/speakers'),
                    fetch('/api/events')
                ]);
                const speakerData = await parseJsonSafe(speakerRes);
                const eventData = await parseJsonSafe(eventRes);
                if (!speakerRes.ok) throw new Error(getErrorMessage(speakerRes, speakerData, "Failed to fetch speakers"));
                if (!eventRes.ok) throw new Error(getErrorMessage(eventRes, eventData, "Failed to fetch events"));
                if (!Array.isArray(speakerData)) throw new Error("Failed to fetch speakers: invalid response");
                if (!Array.isArray(eventData)) throw new Error("Failed to fetch events: invalid response");

                const mappedData = speakerData.map(s => ({
                    ...s,
                    id: s._id,
                    nextEvent: getNextUpcomingEventForSpeaker(eventData, s._id)
                }));
                setSpeakers(mappedData);
            } catch (error) {
                console.error("Error fetching speakers:", error);
                toast.error("Failed to load speakers");
            } finally {
                setLoading(false);
            }
        };
        fetchSpeakers();
    }, []);

    return (
        <GenericCollectionPage
            title="Speakers"
            subtitle={loading ? "Finding experts..." : `Meet our ${speakers.length} world-class speakers`}
            items={speakers}
            categories={["UI/UX DESIGN", "TECHNOLOGY", "BUSINESS"]}
            searchPlaceholder="Search speakers by name, role or category..."
            showFilters={false}
            renderItem={(speaker) => (
                <SpeakerCard 
                    key={speaker.id} 
                    speaker={speaker} 
                />
            )}
            emptyState={{
                icon: loading ? "⏳" : "👥",
                title: loading ? "Loading..." : "No speakers match your search",
                description: loading ? "Please wait..." : "Try searching for a different name or category."
            }}
        />
    );
}
