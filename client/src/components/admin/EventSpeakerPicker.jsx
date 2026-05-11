import React from 'react';
import { X } from 'lucide-react';

const getSpeakerId = (speaker) => String(speaker?._id || speaker?.id || speaker || '');

const EventSpeakerPicker = ({
    speakers = [],
    selectedSpeakerIds = [],
    onAddSpeaker,
    onRemoveSpeaker
}) => {
    const selectedIds = selectedSpeakerIds.map(String);
    const selectedSpeakers = selectedIds.map((speakerId) => {
        const speaker = speakers.find((item) => getSpeakerId(item) === speakerId);
        return {
            id: speakerId,
            name: speaker?.name || 'Unknown speaker'
        };
    });
    const availableSpeakers = speakers.filter((speaker) => !selectedIds.includes(getSpeakerId(speaker)));

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-extrabold text-[#5CB85C] uppercase tracking-widest ml-1">
                Speakers
            </label>
            <select
                value=""
                onChange={(event) => onAddSpeaker(event.target.value)}
                className="w-full bg-[#f4f6f8] text-slate-500 text-sm py-4 px-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:bg-white focus:border-green-500 transition-all appearance-none font-medium cursor-pointer border border-slate-100"
            >
                <option value="" disabled>
                    {availableSpeakers.length ? 'Choose a speaker' : 'All speakers selected'}
                </option>
                {availableSpeakers.map((speaker) => (
                    <option key={getSpeakerId(speaker)} value={getSpeakerId(speaker)}>
                        {speaker.name}
                    </option>
                ))}
            </select>

            <div className="min-h-12 rounded-xl border border-slate-100 bg-slate-50 p-3">
                {selectedSpeakers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedSpeakers.map((speaker) => (
                            <span
                                key={speaker.id}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm border border-slate-100"
                            >
                                {speaker.name}
                                <button
                                    type="button"
                                    onClick={() => onRemoveSpeaker(speaker.id)}
                                    className="rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    aria-label={`Remove ${speaker.name}`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="py-1 text-xs font-bold text-slate-400">No speakers selected</p>
                )}
            </div>
        </div>
    );
};

export default EventSpeakerPicker;
