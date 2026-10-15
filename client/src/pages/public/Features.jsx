import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  Calendar,
  LineChart,
  Bot,
  Sparkles,
  UserCheck,
  Target,
  ArrowRight,
} from 'lucide-react';

export const Features = () => {
  const featureList = [
    {
      icon: LayoutDashboard,
      title: 'Centralized Fitness Dashboard',
      description:
        'A comprehensive command center summarizing today’s logged meals, active routines, weekly progress charts, upcoming scheduled workouts, and quick-action shortcuts.',
    },
    {
      icon: UserCheck,
      title: 'Personal Fitness Profile',
      description:
        'Maintain vital metrics including height, weight, activity levels, experience tier, dietary choices, and measurement units (metric / imperial).',
    },
    {
      icon: Target,
      title: 'Custom Fitness Goals',
      description:
        'Set target workout frequencies, consistency milestones, or target bodyweight. FitMate AI automatically calculates progress from real recorded activities.',
    },
    {
      icon: Utensils,
      title: 'Daily Diet & Meal Tracking',
      description:
        'Log Breakfast, Lunch, Dinner, and Snacks. Daily totals for Calories, Protein, Carbohydrates, and Fat are automatically calculated from stored records.',
    },
    {
      icon: Dumbbell,
      title: 'Workout Routine Planner',
      description:
        'Create modular workout templates. Add exercises, define sets, reps, estimated duration, and rest intervals without confusing templates with logged completions.',
    },
    {
      icon: Calendar,
      title: 'Workout Scheduling & Calendar',
      description:
        'Schedule your training sessions for upcoming days of the week, view scheduled times, mark sessions complete, or reschedule as life demands.',
    },
    {
      icon: LineChart,
      title: 'Analytical Progress & Recharts',
      description:
        'Inspect interactive graphical visualizations of completed sessions over 7-day, 30-day, and 90-day intervals, tracking volume and active minutes.',
    },
    {
      icon: Bot,
      title: 'FitMate AI Fitness Coach',
      description:
        'Chat with an intelligent assistant powered by Google Gemini. Inquire about form guidance, meal balance, progressive overload, and lifestyle habits.',
    },
    {
      icon: Sparkles,
      title: 'Personalized Recommendations',
      description:
        'Dynamic, transparent rule-based insights that inspect your recent logs, remind you of upcoming scheduled sessions, and suggest timely goals.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            Platform Capabilities
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Fitness Features
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every tool is engineered to help you plan, execute, and monitor your personal wellness goals without complexity.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg shadow-emerald-600/20 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to experience FitMate AI?</h2>
          <p className="text-emerald-100 max-w-lg mx-auto text-sm sm:text-base mb-6">
            Join now and take control of your fitness journey with our smart dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 text-white border border-emerald-400 hover:bg-emerald-700 font-medium rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
