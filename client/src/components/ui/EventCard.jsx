import React from 'react';
import { MapPin, CalendarDays } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Badge from './Badge';

const EventCard = ({ 
  event, 
  showButtons = true, 
  className = '', 
  customActions 
}) => {
  const handleRegister = () => {
    toast.success("Registered successfully!");
  };

  return (
    <div className={`bg-white rounded-[20px] shadow-sm overflow-hidden border border-slate-50 flex flex-col h-full transform transition-all hover:translate-y-[-4px] hover:shadow-md ${className}`}>
      {/* Card Header (Image/Preview) */}
      <div 
        className="relative h-44 w-full flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2744 0%, #0f1a35 50%, #1e2d4a 100%)" }}
      >
        <span className="text-white/10 text-6xl font-black italic tracking-tighter select-none font-serif">
          {event.category?.substring(0, 2).toUpperCase() || 'EV'}
        </span>
        
        {event.category && (
          <div className="absolute top-4 right-4">
            <Badge color={event.categoryColor} className="shadow-sm">
              {event.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-1">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center text-slate-500 text-sm font-medium">
            <MapPin size={14} className="mr-2 text-red-500" />
            <span className="truncate">{event.location}</span>
          </div>
          
          {event.date && (
            <div className="flex items-center text-slate-500 text-sm font-medium">
              <CalendarDays size={14} className="mr-2 text-blue-500" />
              <span>{event.date}</span>
            </div>
          )}
        </div>

        {customActions ? (
          <div className="pt-4 border-t border-slate-50">
            {customActions}
          </div>
        ) : showButtons && (
          <div className="space-y-2 pt-2 border-t border-slate-50">
            <button 
              onClick={handleRegister}
              className="w-full bg-[#5CB85C] hover:bg-[#4AA14A] text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              Register Now
            </button>
            <button className="w-full bg-transparent hover:bg-slate-50 text-slate-500 py-2 rounded-xl text-sm font-semibold transition-colors">
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

