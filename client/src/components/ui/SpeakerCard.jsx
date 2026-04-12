import React from 'react';
import { MapPin, Calendar, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

const SpeakerCard = ({ 
  speaker, 
  isAdmin = false, 
  onEdit, 
  onDelete, 
  onViewProfile 
}) => {
  return (
    <div className="bg-white rounded-[22px] p-6 shadow-sm border border-slate-50 flex flex-col gap-6 transition-all hover:shadow-md hover:translate-y-[-4px] group">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#5CB85C] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg shadow-green-100/50 transition-transform group-hover:scale-105 overflow-hidden">
            {speaker.profilePic ? (
              <img src={speaker.profilePic} alt={speaker.name} className="w-full h-full object-cover" />
            ) : (
              speaker.initials
            )}
          </div>
          
          {/* Name & Role */}
          <div className="flex flex-col gap-1 pt-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#5CB85C] transition-colors">{speaker.name}</h3>
            <p className="text-[13px] text-slate-400 font-medium">{speaker.role}</p>
            <div className="mt-2">
              <Badge color="#5CB85C" className="bg-[#5CB85C]/10">
                {speaker.category}
              </Badge>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit?.(speaker)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete?.(speaker)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin size={14} className="text-red-500" />
          <span className="text-[12px] font-medium leading-none truncate">
            Speaking at <span className="text-slate-700 font-semibold">{speaker.event || 'Main Event 2024'}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={14} className="text-blue-500" />
          <span className="text-[12px] font-medium leading-none">{speaker.date || 'Dec 01 — 02, 2024'}</span>
        </div>
      </div>

      {/* Action Button */}
    </div>
  );
};

export default SpeakerCard;
