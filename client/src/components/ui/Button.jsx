import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-[#5CB85C] hover:bg-[#4AA14A] text-white shadow-lg shadow-green-500/20",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm",
    outline: "border-2 border-[#5CB85C] text-[#5CB85C] hover:bg-[#5CB85C]/5",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={`w-4 h-4 mr-2`} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={`w-4 h-4 ml-2`} />}
        </>
      )}
    </button>
  );
};

export default Button;
