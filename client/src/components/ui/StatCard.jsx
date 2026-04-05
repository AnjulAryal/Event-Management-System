import React from 'react';

const StatCard = ({ label, value, color = '#5CB85C', className = '' }) => {
  return (
    <div 
      className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 ${className}`}
      style={{ borderBottomColor: color }}
    >
      <p className="text-slate-500 text-sm font-semibold mb-2">{label}</p>
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</h2>
    </div>
  );
};

export default StatCard;
