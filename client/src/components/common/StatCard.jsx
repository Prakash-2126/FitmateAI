import React from 'react';

export const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  badgeText,
  badgeColor = 'emerald',
  onClick,
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    blue: 'bg-sky-50 text-sky-700 border-sky-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  };

  const iconClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    blue: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-2xl card-hover-lift card-shine transition-all duration-300 overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-emerald-300' : ''
      }`}
    >
      {/* Decorative gradient corner glow on hover */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
            iconClasses[badgeColor] || iconClasses.emerald
          }`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {badgeText && (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${
              badgeClasses[badgeColor] || badgeClasses.emerald
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
          {value}
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</div>
        {subtext && <div className="text-xs text-slate-400 mt-2 font-medium">{subtext}</div>}
      </div>
    </div>
  );
};
