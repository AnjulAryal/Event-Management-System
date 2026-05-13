import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

const Select = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  options = [],
  ...props 
}) => {
  const baseSelectStyles = `
    w-full rounded-xl border appearance-none transition-all text-sm font-medium focus:outline-none focus:ring-2
    ${Icon ? 'pl-11' : 'pl-4'}
    pr-10
    ${error 
      ? 'bg-red-50 border-red-500 focus:ring-red-200 text-red-900' 
      : 'bg-[#F3F5F9] border-transparent focus:ring-[#5CB85C]/20 text-slate-700'
    }
    ${className}
  `;

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#5CB85C] ml-1 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <select
          className={`${baseSelectStyles} py-3`}
          {...props}
        >
          <option value="" disabled>{props.placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-red-500 ml-1">
          <AlertCircle size={12} />
          <span className="text-[10px] font-bold">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;
