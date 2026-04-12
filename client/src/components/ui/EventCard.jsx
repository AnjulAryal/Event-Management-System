import React from 'react';
import { MapPin, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';

const EventCard = ({ 
  event, 
  showButtons = true, 
  className = '', 
  customActions 
}) => {
  const navigate = useNavigate();
  const isRegistered = Boolean(event?.isRegistered);

  const handleRegister = () => {
    if (isRegistered) {
      navigate(`/event-details/${event.id}`);
      return;
    }
    navigate(`/complete-registration/${event.id}`);
  };

  return (
    <div className={`bg-white rounded-[20px] shadow-sm overflow-hidden border border-slate-50 flex flex-col h-full transform transition-all hover:translate-y-[-4px] hover:shadow-md ${className}`}>
      {/* Card Header (Image/Preview) */}
      <div 
        className="relative h-44 w-full flex items-center justify-center overflow-hidden bg-[#1c2331]"
        style={!event.coverImage ? { background: "linear-gradient(135deg, #1a2744 0%, #0f1a35 50%, #1e2d4a 100%)" } : {}}
      >
        {event.coverImage ? (
          <img 
            src={event.coverImage.startsWith('data:image') || event.coverImage.startsWith('http') ? event.coverImage : `http://localhost:5000/${event.coverImage.replace(/^\/+/, '')}`}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-white/10 text-6xl font-black italic tracking-tighter select-none font-serif">
            {event.category?.substring(0, 2).toUpperCase() || 'EV'}
          </span>
        )}
        
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
          <div className="space-y-3 pt-2">
            <button 
              onClick={handleRegister}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] ${
                isRegistered
                  ? 'bg-[#5CB85C] text-white'
                  : 'bg-[#5CB85C] hover:bg-[#4AA14A] text-white'
              }`}
            >
              {isRegistered ? 'Registered' : 'Register Now'}
            </button>
            <button 
              onClick={() => navigate(`/event-details/${event.id}`)}
              className="w-full bg-[#F3F6F9] hover:bg-[#E8EDF2] text-[#5E718D] py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

