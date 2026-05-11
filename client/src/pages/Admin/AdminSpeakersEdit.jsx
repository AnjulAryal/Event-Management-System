import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SpeakerForm from '../../components/admin/SpeakerForm';

const AdminSpeakersEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [speaker, setSpeaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSpeaker = async () => {
            try {
                const res = await fetch(`/api/speakers/${id}`);
                if (!res.ok) throw new Error('Speaker not found');

                const speakerToEdit = await res.json();
                setSpeaker(speakerToEdit);
            } catch (error) {
                console.error('Error fetching speaker:', error);
                toast.error('Speaker not found!');
                navigate('/admin-speakers');
            } finally {
                setLoading(false);
            }
        };

        fetchSpeaker();
    }, [id, navigate]);

    const handleUpdate = async (speakerPayload) => {
        setIsSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const res = await fetch(`/api/speakers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(speakerPayload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update speaker');
            }

            toast.success('Speaker information updated!');
            navigate('/admin-speakers');
        } catch (error) {
            console.error('Error updating speaker:', error);
            toast.error(error.message || 'Failed to update speaker');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#5CB85C]" />
            </div>
        );
    }

    if (!speaker) return null;

    return (
        <SpeakerForm
            key={speaker._id || id}
            mode="edit"
            initialSpeaker={speaker}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
        />
    );
};

export default AdminSpeakersEdit;
