import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Dumbbell,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Flame,
  Award,
  Sun,
  Moon,
  Sunrise,
  Activity,
  Zap,
  Bot,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { useAuth } from '../../context/AuthContext';
import { getMeals } from '../../api/meals';
import { getWorkouts } from '../../api/workouts';
import { getSchedules } from '../../api/schedule';
import { getGoals } from '../../api/goals';
import { getProgress } from '../../api/progress';
import { getRecommendations } from '../../api/recommendations';

import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner, DashboardSkeleton } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';


export const Dashboard = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);

  const [todayMeals, setTodayMeals] = useState([]);
  const [nutritionTotals, setNutritionTotals] = useState({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  const [upcomingSchedule, setUpcomingSchedule] = useState(null);
  const [activeGoals, setActiveGoals] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const todayStr = new Date().toISOString().split('T')[0];

        const [mealsRes, schedRes, goalsRes, progRes, recsRes] = await Promise.all([
          getMeals({ date: todayStr }).catch(() => ({ data: [], totals: { calories: 0 } })),
          getSchedules({ status: 'scheduled' }).catch(() => ({ data: [] })),
          getGoals('active').catch(() => ({ data: [] })),
          getProgress({ range: '7d' }).catch(() => ({ summary: {}, timelineData: [] })),
          getRecommendations().catch(() => ({ data: [] })),
        ]);

        setTodayMeals(mealsRes?.data || []);
        setNutritionTotals(mealsRes?.totals || { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

        const upcoming = (schedRes?.data || [])[0] || null;
        setUpcomingSchedule(upcoming);

        setActiveGoals(goalsRes?.data || []);
        setProgressSummary(progRes?.summary || null);
        setChartData(progRes?.timelineData || []);
        setRecommendations((recsRes?.data || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sunrise };
    if (hour < 18) return { text: 'Good afternoon', icon: Sun };
    return { text: 'Good evening', icon: Moon };
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const { text: greetingText, icon: GreetingIcon } = getGreetingData();

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-300 pb-1 border-b border-slate-800">
            {new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Workouts:</span>
            <span className="font-bold text-emerald-400">{data.workouts} session{data.workouts > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Duration:</span>
            <span className="font-bold text-white">{data.duration} mins</span>
          </div>
          {data.caloriesBurned > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Burned:</span>
              <span className="font-bold text-amber-400">{data.caloriesBurned} kcal</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 page-transition">
      {/* Radiant Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 animate-fade-up card-shine">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-10 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none animate-float-y-delay" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <GreetingIcon className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              {greetingText}, {user?.name?.split(' ')[0] || 'Athlete'}! 💪
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              {activeGoals.length > 0
                ? `You have ${activeGoals.length} active goal${activeGoals.length > 1 ? 's' : ''} in flight. Maintain your training momentum today!`
                : 'Welcome to your FitMate AI command center. Plan your workouts, log nutrition, and build healthy habits.'}
            </p>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/diet"
                className="btn-magnetic inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-emerald-500/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Meal</span>
              </Link>
              <Link
                to="/workouts"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all hover:border-slate-500"
              >
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Workouts</span>
              </Link>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-950/80 hover:bg-teal-900 border border-teal-500/30 text-teal-200 rounded-xl text-xs font-bold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Ask AI Coach</span>
              </Link>
            </div>
          </div>

          {/* Quick Streak & Calorie Widget in Banner */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 max-w-sm w-full lg:w-auto">
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-center hover:border-amber-500/30 transition-all duration-300 group">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white counter-animate">{nutritionTotals.calories}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">kcal Today</div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white counter-animate">{progressSummary?.totalWorkouts || 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sessions (7d)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <div className="animate-fade-up">
          <StatCard
            icon={Utensils}
            label="Meals Logged"
            value={todayMeals.length}
            subtext={`${nutritionTotals.calories} kcal recorded today`}
            badgeText="Today"
            badgeColor="emerald"
          />
        </div>
        <div className="animate-fade-up-d1">
          <StatCard
            icon={Flame}
            label="Calories & Energy"
            value={`${nutritionTotals.calories} kcal`}
            subtext={`P: ${nutritionTotals.protein}g | C: ${nutritionTotals.carbohydrates}g | F: ${nutritionTotals.fat}g`}
            badgeText="Macronutrients"
            badgeColor="amber"
          />
        </div>
        <div className="animate-fade-up-d2">
          <StatCard
            icon={Dumbbell}
            label="Completed Workouts"
            value={progressSummary?.totalWorkouts || 0}
            subtext={`${progressSummary?.totalDurationMinutes || 0} active minutes this week`}
            badgeText="7-Day History"
            badgeColor="blue"
          />
        </div>
        <div className="animate-fade-up-d3">
          <StatCard
            icon={Target}
            label="Active Fitness Goals"
            value={activeGoals.length}
            subtext={`${progressSummary?.completedGoalsCount || 0} goals achieved`}
            badgeText="Targets"
            badgeColor="purple"
          />
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Weekly Activity & Meals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Activity Chart with Gradient */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  7-Day Workout Activity
                </h3>
                <p className="text-xs text-slate-400">
                  Daily recorded sessions and duration from verified logs
                </p>
              </div>
              <Link
                to="/progress"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {chartData.length > 0 ? (
              <div className="h-68 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="emeraldBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return d.toLocaleDateString('en-US', { weekday: 'short' });
                      }}
                      stroke="#94a3b8"
                      fontSize={11}
                    />
                    <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="workouts"
                      fill="url(#emeraldBarGradient)"
                      radius={[8, 8, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                No workouts recorded in the past 7 days. Complete a workout to see your activity graph!
              </div>
            )}
          </div>

          {/* Today's Meals Breakdown Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Today's Nutrition Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">
                    {todayMeals.length} logged item{todayMeals.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <Link
                to="/diet"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Meal</span>
              </Link>
            </div>

            {/* Quick Macro Pills */}
            <div className="grid grid-cols-4 gap-2 mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories</span>
                <span className="font-extrabold text-slate-900">{nutritionTotals.calories} kcal</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Protein</span>
                <span className="font-extrabold text-slate-900">{nutritionTotals.protein}g</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Carbs</span>
                <span className="font-extrabold text-slate-900">{nutritionTotals.carbohydrates}g</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Fat</span>
                <span className="font-extrabold text-slate-900">{nutritionTotals.fat}g</span>
              </div>
            </div>

            {todayMeals.length === 0 ? (
              <EmptyState
                icon={Utensils}
                title="No meals logged today"
                description="Keep track of your protein and energy by logging what you eat today."
                actionText="Log First Meal"
                onAction={() => (window.location.href = '/diet')}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {todayMeals.map((meal) => (
                  <div key={meal._id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{meal.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            meal.category === 'Breakfast'
                              ? 'bg-amber-100 text-amber-800'
                              : meal.category === 'Lunch'
                              ? 'bg-emerald-100 text-emerald-800'
                              : meal.category === 'Dinner'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {meal.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {meal.time && `${meal.time} • `}
                        {meal.foodDescription || 'Logged meal'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900">
                        {meal.calories ? `${meal.calories} kcal` : '—'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {meal.protein ? `P: ${meal.protein}g` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Upcoming Session & Recommendations */}
        <div className="space-y-8">
          {/* Upcoming Workout Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Upcoming Session
              </h3>
              <Link to="/schedule" className="text-xs font-bold text-emerald-600 hover:underline">
                View Calendar
              </Link>
            </div>

            {upcomingSchedule ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {upcomingSchedule.workout?.name || 'Scheduled Workout'}
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {new Date(upcomingSchedule.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-4 flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {upcomingSchedule.scheduledTime || 'Flexible time'}
                  </span>
                  <span>•</span>
                  <span>~{upcomingSchedule.workout?.estimatedDuration || 45} mins</span>
                </div>
                <Link
                  to={`/workouts/${upcomingSchedule.workout?._id || ''}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <span>Open Routine Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-500 mb-3 font-medium">No upcoming workouts scheduled.</p>
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plan Next Session</span>
                </Link>
              </div>
            )}
          </div>

          {/* Smart Insights & Recommendations Widget */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Adaptive Insights
              </h3>
              <Link to="/recommendations" className="text-xs font-bold text-emerald-600 hover:underline">
                All ({recommendations.length})
              </Link>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all hover:bg-white"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {rec.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 mb-1">{rec.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      {rec.description}
                    </p>
                    <Link
                      to={rec.actionUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <span>{rec.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">All insights up to date.</p>
            )}
          </div>

          {/* Interactive AI Coach Prompt Launcher */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 rounded-3xl text-white shadow-md border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">AI Fitness Coach</span>
            </div>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Have questions regarding exercise form, training splits, or optimal protein intake? Chat with your dedicated assistant.
            </p>
            <Link
              to="/ai-assistant"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
