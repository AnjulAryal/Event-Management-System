import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SpeakerForm from '../../components/admin/SpeakerForm';

const Adminaddspeaker = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (speakerPayload) => {
        setIsSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const res = await fetch('/api/speakers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(speakerPayload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to add speaker');
            }

            toast.success('Speaker added successfully!');
            navigate('/admin-speakers');
        } catch (error) {
            console.error('Error adding speaker:', error);
            toast.error(error.message || 'Failed to add speaker');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SpeakerForm
            mode="add"
            onSubmit={handleSave}
            isSubmitting={isSubmitting}
        />
    );
};

export default Adminaddspeaker;
