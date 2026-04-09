import { useState, useEffect } from "react";
import GenericCollectionPage from "../../components/user/GenericCollectionPage";
import SpeakerCard from "../../components/ui/SpeakerCard";

export default function Speakers() {
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const res = await fetch('/api/speakers');
                const data = await res.json();
                const mappedData = data.map(s => ({ ...s, id: s._id }));
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
