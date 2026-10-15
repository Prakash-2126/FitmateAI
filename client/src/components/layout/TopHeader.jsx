import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Sparkles,
  Calendar as CalendarIcon,
  Flame,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopHeader = ({ onMenuClick, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Streak, Date, AI Quick button, and User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Active Streak</span>
        </div>

        {/* Date pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-semibold text-slate-600">
          <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>{todayStr}</span>
        </div>

        {/* AI quick ask button */}
        <Link
          to="/ai-assistant"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-500/30 transition-all shadow-2xs hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Coach</span>
        </Link>

        {/* Profile avatar link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden lg:inline text-xs font-bold text-slate-800 max-w-[120px] truncate">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
};
