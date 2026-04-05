import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ 
  value, 
  onChange, 
  max = 5, 
  size = 24, 
  readonly = false,
  error = false 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {[...Array(max)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star
              key={i}
              size={size}
              className={`
                ${readonly ? '' : 'cursor-pointer transition-all active:scale-90'}
                ${starValue <= value 
                  ? 'fill-amber-400 text-amber-400' 
                  : (error ? 'text-red-200' : 'text-slate-200')
                }
                ${!readonly && starValue > value ? 'hover:text-amber-200' : ''}
              `}
              onClick={() => !readonly && onChange?.(starValue)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Rating;
