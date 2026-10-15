import React from 'react';
import { Loader2, Activity } from 'lucide-react';

/* ─── Shimmer Skeleton Box ────────────────────── */
const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

/* ─── Dashboard Skeleton Loader ───────────────── */
export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-fade-up">
    {/* Welcome banner skeleton */}
    <div className="skeleton h-40 rounded-3xl" />

    {/* Stat cards skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-10 h-10 rounded-xl" />
            <SkeletonBox className="h-3 w-24" />
          </div>
          <SkeletonBox className="h-6 w-16" />
          <SkeletonBox className="h-2.5 w-full" />
        </div>
      ))}
    </div>

    {/* Main content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <SkeletonBox className="h-5 w-48 mb-2" />
          <SkeletonBox className="h-3 w-64 mb-6" />
          <SkeletonBox className="h-44 w-full rounded-2xl" />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <SkeletonBox className="h-5 w-48 mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50">
              <div className="space-y-2">
                <SkeletonBox className="h-3.5 w-32" />
                <SkeletonBox className="h-2.5 w-24" />
              </div>
              <SkeletonBox className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <SkeletonBox className="h-5 w-36 mb-4" />
          <SkeletonBox className="h-28 w-full rounded-2xl" />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <SkeletonBox className="h-5 w-36 mb-4" />
          {[...Array(2)].map((_, i) => (
            <SkeletonBox key={i} className="h-20 w-full rounded-2xl mb-3" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Page-level Loading Spinner ──────────────── */
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-500">
      {/* Animated logo */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25 animate-scale-in-bounce">
          <Activity className="w-8 h-8" />
        </div>
        {/* Rotating ring */}
        <div className="absolute -inset-1.5 rounded-[18px] border-2 border-transparent border-t-emerald-500 animate-spin" />
        <div className="absolute -inset-3 rounded-[22px] border border-emerald-500/20 animate-pulse" />
      </div>
      {text && (
        <div className="text-center animate-fade-up-d1">
          <p className="text-sm font-semibold text-slate-600">{text}</p>
          <p className="text-xs text-slate-400 mt-0.5">Please wait a moment…</p>
        </div>
      )}
    </div>
  );
};
