import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import GenericCollectionPage from "../../components/user/GenericCollectionPage";
import SpeakerCard from "../../components/ui/SpeakerCard";
import { getErrorMessage, parseJsonSafe } from "../../utils/safeJson";

export default function Speakers() {
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const res = await fetch('/api/speakers');
                const data = await parseJsonSafe(res);
                if (!res.ok) throw new Error(getErrorMessage(res, data, "Failed to fetch speakers"));
                if (!Array.isArray(data)) throw new Error("Failed to fetch speakers: invalid response");
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
