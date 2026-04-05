import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text', 
  className = '', 
  containerClassName = '',
  multiline = false,
  rows = 4,
  rightElement,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputStyles = `
    w-full rounded-xl border transition-all text-sm font-medium focus:outline-none focus:ring-2
    ${Icon ? 'pl-11' : 'pl-4'}
    ${(isPassword || rightElement) ? 'pr-12' : 'pr-4'}
    ${error 
      ? 'bg-red-50 border-red-500 focus:ring-red-200 text-red-900 placeholder:text-red-300' 
      : 'bg-[#F3F5F9] border-transparent focus:ring-[#5CB85C]/20 text-slate-700 placeholder:text-slate-400'
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        {multiline ? (
          <textarea
            className={`${baseInputStyles} py-4 min-h-[120px] resize-none`}
            rows={rows}
            {...props}
          />
        ) : (
          <input
            type={inputType}
            className={`${baseInputStyles} py-3`}
            {...props}
          />
        )}
        
        {isPassword && !multiline && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {rightElement && !isPassword && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
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

export default Input;


