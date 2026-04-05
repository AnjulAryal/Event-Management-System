import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '',
  color,
  ...props 
}) => {
  const variants = {
    primary: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-slate-100 text-slate-600",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  const style = color ? { backgroundColor: `${color}15`, color: color } : {};

  return (
    <span 
      style={style}
      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${!color ? variants[variant] : ''} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
