import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Target, HeartHandshake, CheckCircle } from 'lucide-react';

export const About = () => {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            About Project
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About FitMate AI
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            A comprehensive, AI-assisted personal fitness and wellness management web application built on the MERN stack.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          {/* Card 1: Purpose & Problem */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Purpose & Problem Solved
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Modern fitness tracking is often fragmented across multiple disparate applications: one app for calorie counting, another for exercise notes, and expensive monthly subscriptions for basic coaching advice.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              FitMate AI solves this problem by centralizing your entire fitness journey into a unified, privacy-respecting dashboard. From custom workout routine construction and calendar scheduling to meal logging, progress visualizations, and conversational AI coaching, users have full visibility over their health metrics in one place.
            </p>
          </div>

          {/* Card 2: Primary Objectives */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Key Architectural Objectives
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold block text-slate-900 mb-1">True Full-Stack MERN</span>
                Built with Node.js, Express, React, Vite, and MongoDB with clean REST endpoints and ownership verification.
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold block text-slate-900 mb-1">Secure Authentication</span>
                Salted bcrypt password hashing, JWT authorization, protected routes, and HTTP-only cookie support.
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold block text-slate-900 mb-1">Transparent AI Coaching</span>
                Modular server-side integration that securely connects to state-of-the-art LLMs like Google Gemini.
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold block text-slate-900 mb-1">Authentic Record Analytics</span>
                Calculates progress strictly from stored user logs rather than synthetic placeholders.
              </div>
            </div>
          </div>

          {/* Card 3: Intended Users */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              Intended Audience
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              FitMate AI is crafted for:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
              <li><strong>Beginners:</strong> Seeking step-by-step guidance on exercise techniques and foundational workout routines.</li>
              <li><strong>Fitness Enthusiasts:</strong> Wanting a quick way to log workouts, track progressive overload, and monitor calories.</li>
              <li><strong>Students & Developers:</strong> Interested in a production-grade full-stack architecture demonstrating best engineering practices.</li>
            </ul>
          </div>

          {/* Card 4: Clinical Disclaimer & Limitations */}
          <div className="bg-amber-50/70 p-8 rounded-2xl border border-amber-200/80 text-amber-900 shadow-xs">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Important Limitations & Medical Disclaimer
            </h2>
            <p className="text-sm leading-relaxed mb-3 text-amber-800/90">
              FitMate AI is designed strictly for general educational and personal wellness tracking purposes.
            </p>
            <p className="text-sm leading-relaxed text-amber-800/90">
              The application and its AI assistant do not provide medical advice, diagnosis, or clinical treatment plans. Users experiencing acute physical discomfort, chronic injuries, eating disorders, or underlying health conditions must consult licensed physicians and qualified healthcare professionals before undertaking intense physical exercise or drastic dietary adjustments.
            </p>
          </div>
        </div>

        {/* Back navigation */}
        <div className="text-center mt-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};
