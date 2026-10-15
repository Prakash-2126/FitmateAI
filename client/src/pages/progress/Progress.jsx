import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  Calendar,
  Dumbbell,
  Clock,
  Flame,
  Award,
  Scale,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import { getProgress } from '../../api/progress';
import { getWorkoutCompletions } from '../../api/completions';
import { useNotification } from '../../context/NotificationContext';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const Progress = () => {
  const { notify } = useNotification();
  const [range, setRange] = useState('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [progressData, setProgressData] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = { range };
      if (range === 'custom') {
        if (customStart) params.startDate = customStart;
        if (customEnd) params.endDate = customEnd;
      }

      const [pRes, cRes] = await Promise.all([
        getProgress(params),
        getWorkoutCompletions({ limit: 10 }),
      ]);

      setProgressData(pRes || null);
      setCompletions(cRes?.data || []);
    } catch (err) {
      notify('Failed to load progress analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (range !== 'custom' || (customStart && customEnd)) {
      fetchAnalytics();
    }
  }, [range, customStart, customEnd]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Aggregating progress metrics..." />;
  }

  const summary = progressData?.summary || {};
  const timelineData = progressData?.timelineData || [];
  const goals = progressData?.goals || [];
  const profileWeight = progressData?.profileWeight || {};

  return (
    <div className="space-y-8">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Progress & Analytics</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Visualize your exercise volume, duration, goal progress, and habits based on verified records.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-xs">
          {[
            { label: '7 Days', val: '7d' },
            { label: '30 Days', val: '30d' },
            { label: '90 Days', val: '90d' },
            { label: 'Custom', val: 'custom' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setRange(item.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                range === item.val
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {range === 'custom' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Start Date:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="p-1.5 border rounded-lg"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">End Date:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="p-1.5 border rounded-lg"
            />
          </label>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Dumbbell}
          label="Total Workouts Completed"
          value={summary.totalWorkouts || 0}
          subtext="Recorded workout sessions"
          badgeText={range}
          badgeColor="emerald"
        />
        <StatCard
          icon={Clock}
          label="Total Training Time"
          value={`${summary.totalDurationHours || 0} hrs`}
          subtext={`${summary.totalDurationMinutes || 0} total minutes`}
          badgeText="Active"
          badgeColor="blue"
        />
        <StatCard
          icon={Flame}
          label="Estimated Calories Burned"
          value={`${summary.totalCaloriesBurned || 0} kcal`}
          subtext={`Avg ${summary.averageDuration || 0} min per session`}
          badgeText="Workouts"
          badgeColor="amber"
        />
        <StatCard
          icon={Scale}
          label="Current Body Weight"
          value={
            profileWeight.current
              ? `${profileWeight.current} ${profileWeight.unit}`
              : 'Not set'
          }
          subtext={
            profileWeight.target
              ? `Target: ${profileWeight.target} ${profileWeight.unit}`
              : 'Add target in profile'
          }
          badgeText="Bodyweight"
          badgeColor="purple"
        />
      </div>

      {/* Primary Chart: Workout Frequency & Duration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-base font-bold text-slate-900">Training Duration & Frequency Timeline</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily minutes exercised plotted over the selected timeframe
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              Duration (Minutes)
            </span>
          </div>
        </div>

        {timelineData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="barProgressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    const parts = val.split('-');
                    return `${parts[1]}/${parts[2]}`;
                  }}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/60 text-xs">
                          <p className="text-slate-400 font-medium mb-1">
                            {new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                            {payload[0].value} minutes trained
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="duration" fill="url(#barProgressGrad)" radius={[8, 8, 2, 2]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            No activity records recorded during this timeframe.
          </div>
        )}
      </div>

      {/* Secondary Chart: Daily Calories Burned vs Consumed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Nutrition vs Exercise Energy Balance</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged calories consumed (meals) versus estimated calories burned (workouts)
            </p>
          </div>
        </div>

        {timelineData.length > 0 ? (
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    const parts = val.split('-');
                    return `${parts[1]}/${parts[2]}`;
                  }}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-700/60 text-xs space-y-1">
                          <p className="text-slate-400 font-medium">
                            {new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          {payload.map((item, idx) => (
                            <p key={idx} className="font-semibold flex items-center justify-between gap-3" style={{ color: item.color }}>
                              <span>{item.name}:</span>
                              <span>{item.value} kcal</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="caloriesConsumed"
                  name="Diet Intake"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="caloriesBurned"
                  name="Workout Burn"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            No calorie records found for this period.
          </div>
        )}
      </div>

      {/* Goal Progress Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          Fitness Goals Progress Summary
        </h3>

        {goals.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 italic">No fitness goals configured yet. Add goals in the Goals section.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const hasTarget = goal.targetValue && goal.targetValue > 0;
              const percent = hasTarget
                ? Math.min(Math.round(((goal.currentProgress || 0) / goal.targetValue) * 100), 100)
                : 0;

              return (
                <div key={goal._id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{goal.title}</h4>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        goal.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {goal.status}
                    </span>
                  </div>
                  {hasTarget && (
                    <>
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                        <span>
                          {goal.currentProgress || 0} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="font-bold text-emerald-600">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Workout Completions Log */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-emerald-600" />
          Recent Workout Completion Records
        </h3>

        {completions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 italic">
            No completed sessions recorded yet. Start logging workouts to build history.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {completions.map((comp) => (
              <div key={comp._id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 rounded-xl px-2 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{comp.workoutName}</h4>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">
                    {new Date(comp.completionDate).toLocaleDateString()} • {comp.durationMinutes} mins
                    {comp.caloriesBurned ? ` • ${comp.caloriesBurned} kcal burned` : ''}
                  </div>
                  {comp.notes && (
                    <div className="text-[11px] text-slate-400 italic mt-0.5">
                      "{comp.notes}"
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scientific/Medical Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong>Note on Fitness Data:</strong> Recorded workout counts and volume represent behavioral consistency and activity tracking. They do not constitute clinical physiological diagnostics or direct measurements of cardiovascular fitness.
        </div>
      </div>
    </div>
  );
};

