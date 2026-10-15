import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  Dumbbell,
  Utensils,
  Calendar,
  Award,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { getRecommendations } from '../../api/recommendations';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await getRecommendations();
        setRecommendations(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Analyzing fitness activity logs..." />;
  }

  const getIcon = (cat) => {
    switch (cat) {
      case 'Profile':
        return UserCheck;
      case 'Workouts':
        return Dumbbell;
      case 'Nutrition':
        return Utensils;
      case 'Schedule':
        return Calendar;
      case 'Goals':
        return Award;
      default:
        return TrendingUp;
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Rule-Based Fitness Intelligence</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Personalized Recommendations
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Actionable wellness insights dynamically computed from your active goals, workout history, and nutrition logs.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="All caught up!"
          description="Your fitness profile, routines, meals, and goals are fully updated. Great work maintaining your wellness routine!"
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const Icon = getIcon(rec.category);

            return (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                          rec.priority
                        )}`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {rec.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <Link
                    to={rec.actionUrl}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
