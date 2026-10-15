import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/diet')) return 'Diet & Nutrition Tracker';
    if (path.startsWith('/cook-your-meal')) return 'Cook Your Meal • Diet-Friendly Cooking Videos';
    if (path.startsWith('/workouts')) return 'Workout Routines';
    if (path.startsWith('/schedule')) return 'Weekly Workout Schedule';
    if (path.startsWith('/exercises')) return 'Exercise Library';
    if (path.startsWith('/progress')) return 'Progress & Analytics';
    if (path.startsWith('/ai-assistant')) return 'FitMate AI Coach';
    if (path.startsWith('/recommendations')) return 'Personalized Recommendations';
    if (path.startsWith('/goals')) return 'Fitness Goals';
    if (path.startsWith('/profile')) return 'Personal Profile';
    if (path.startsWith('/settings')) return 'Account Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
