import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  ChefHat,
  Dumbbell,
  Calendar,
  BookOpen,
  LineChart,
  Bot,
  Sparkles,
  Target,
  User,
  Settings,
  LogOut,
  Activity,
  X,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Diet Tracker', path: '/diet', icon: Utensils },
    { name: 'Cook Your Meal', path: '/cook-your-meal', icon: ChefHat, badge: 'Videos' },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Exercise Library', path: '/exercises', icon: BookOpen },
    { name: 'Progress & Charts', path: '/progress', icon: LineChart },
    { name: 'AI Coach', path: '/ai-assistant', icon: Bot, highlight: true },
    { name: 'Smart Insights', path: '/recommendations', icon: Sparkles },
    { name: 'Fitness Goals', path: '/goals', icon: Target },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-68 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-6 border-b border-slate-100">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight block">
              FitMate <span className="text-emerald-600">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block -mt-1">
              Command Center
            </span>
          </div>
        </NavLink>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3.5 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-extrabold translate-x-1'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70 hover:translate-x-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'text-white scale-110'
                        : item.highlight
                        ? 'text-emerald-600 group-hover:scale-110'
                        : 'text-slate-400 group-hover:text-slate-700 group-hover:scale-110'
                    }`}
                  />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span
                      className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase transition-all ${
                        isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-emerald-100 text-emerald-800 animate-pulse'
                      }`}
                    >
                      AI
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase transition-all ${
                        isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-amber-100 text-amber-800 animate-bounce-subtle'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-xs shadow-sm shadow-emerald-600/20 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate leading-none mb-1">
              {user?.name || 'User'}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active Athlete</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
