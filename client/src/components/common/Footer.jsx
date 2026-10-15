import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">
                FitMate <span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your personal AI fitness & wellness management companion. Intelligent workout planning, meal tracking, and health metrics.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About Project</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Wellness Modules */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2">
              <li><Link to="/diet" className="hover:text-emerald-400 transition-colors">Diet & Nutrition Tracker</Link></li>
              <li><Link to="/workouts" className="hover:text-emerald-400 transition-colors">Workout Planner</Link></li>
              <li><Link to="/exercises" className="hover:text-emerald-400 transition-colors">Exercise Library</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-emerald-400 transition-colors">AI Fitness Coach</Link></li>
            </ul>
          </div>

          {/* Legal & Medical */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Compliance & Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 leading-normal">
              FitMate AI provides educational guidance only and is not a substitute for clinical or physician advice.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FitMate AI Platform. Built with the MERN Stack.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
