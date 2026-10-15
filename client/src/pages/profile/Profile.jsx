import React, { useState, useEffect } from 'react';
import { User, Activity, Scale, Ruler, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getProfile, updateProfile } from '../../api/profile';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { notify } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'prefer_not_to_say',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: 'moderately_active',
    fitnessExperience: 'beginner',
    preferredWorkoutTypes: ['Strength Training', 'Cardio'],
    dietaryPreferences: [],
    fitnessPreferences: '',
    measurementUnit: 'metric',
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const res = await getProfile();
        if (res?.data) {
          const p = res.data;
          setFormData({
            name: p.user?.name || user?.name || '',
            age: p.age !== null && p.age !== undefined ? p.age : '',
            gender: p.gender || 'prefer_not_to_say',
            height: p.height !== null && p.height !== undefined ? p.height : '',
            currentWeight: p.currentWeight !== null && p.currentWeight !== undefined ? p.currentWeight : '',
            targetWeight: p.targetWeight !== null && p.targetWeight !== undefined ? p.targetWeight : '',
            activityLevel: p.activityLevel || 'moderately_active',
            fitnessExperience: p.fitnessExperience || 'beginner',
            preferredWorkoutTypes: p.preferredWorkoutTypes || ['Strength Training', 'Cardio'],
            dietaryPreferences: p.dietaryPreferences || [],
            fitnessPreferences: p.fitnessPreferences || '',
            measurementUnit: p.measurementUnit || 'metric',
          });
        }
      } catch (err) {
        setErrorMsg('Unable to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleWorkoutType = (type) => {
    setFormData((prev) => {
      const exists = prev.preferredWorkoutTypes.includes(type);
      return {
        ...prev,
        preferredWorkoutTypes: exists
          ? prev.preferredWorkoutTypes.filter((t) => t !== type)
          : [...prev.preferredWorkoutTypes, type],
      };
    });
  };

  const toggleDietaryPref = (diet) => {
    setFormData((prev) => {
      const exists = prev.dietaryPreferences.includes(diet);
      return {
        ...prev,
        dietaryPreferences: exists
          ? prev.dietaryPreferences.filter((d) => d !== diet)
          : [...prev.dietaryPreferences, diet],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateUserProfile(formData);
      setSuccessMsg('Profile updated successfully!');
      notify('Profile updated successfully!', 'success');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading fitness profile..." />;
  }

  const workoutOptions = [
    'Strength Training',
    'Bodyweight & Calisthenics',
    'Cardio & Running',
    'HIIT',
    'Yoga & Mobility',
    'Pilates',
  ];

  const dietOptions = [
    'Balanced / General',
    'High-Protein',
    'Vegetarian',
    'Vegan',
    'Keto / Low-Carb',
    'Gluten-Free',
  ];

  const isIncomplete = !formData.height || !formData.currentWeight;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fitness Profile</h2>
        <p className="text-sm text-slate-500 mt-1">
          Personalize your physical metrics, training experience, and preferences to receive accurate guidance.
        </p>
      </div>

      {isIncomplete && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <span className="font-bold">Your profile is currently incomplete.</span> Please add your height and current weight so FitMate AI can compute accurate benchmarks and tailored recommendations.
          </div>
        </div>
      )}

      {successMsg && <Alert type="success" message={successMsg} />}
      {errorMsg && <Alert type="error" message={errorMsg} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-600" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Age
              </label>
              <input
                type="number"
                name="age"
                min="10"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender Identity
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Physical Measurements with Dynamic BMI Preview */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Physical Metrics & Live BMI Benchmark
            </h3>

            {/* Dynamic BMI Pill */}
            {(() => {
              const hM = formData.measurementUnit === 'imperial'
                ? (Number(formData.height) * 0.0254)
                : (Number(formData.height) / 100);
              const wKg = formData.measurementUnit === 'imperial'
                ? (Number(formData.currentWeight) * 0.453592)
                : Number(formData.currentWeight);
              const bmiVal = (hM > 0 && wKg > 0) ? (wKg / (hM * hM)).toFixed(1) : null;

              if (!bmiVal || isNaN(bmiVal)) return null;

              const bmiNum = Number(bmiVal);
              let tag = 'Normal Range';
              let tagColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (bmiNum < 18.5) {
                tag = 'Underweight';
                tagColor = 'bg-amber-50 text-amber-700 border-amber-200';
              } else if (bmiNum >= 25 && bmiNum < 30) {
                tag = 'Overweight';
                tagColor = 'bg-amber-50 text-amber-700 border-amber-200';
              } else if (bmiNum >= 30) {
                tag = 'Obese Range';
                tagColor = 'bg-rose-50 text-rose-700 border-rose-200';
              }

              return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${tagColor}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Calculated BMI: {bmiVal} ({tag})</span>
                </div>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Height ({formData.measurementUnit === 'imperial' ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                name="height"
                step="0.5"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 175"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Weight ({formData.measurementUnit === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                type="number"
                name="currentWeight"
                step="0.5"
                value={formData.currentWeight}
                onChange={handleChange}
                placeholder="e.g. 70"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Weight ({formData.measurementUnit === 'imperial' ? 'lbs' : 'kg'}) (Optional)
              </label>
              <input
                type="number"
                name="targetWeight"
                step="0.5"
                value={formData.targetWeight}
                onChange={handleChange}
                placeholder="e.g. 68"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Measurement System
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="measurementUnit"
                  value="metric"
                  checked={formData.measurementUnit === 'metric'}
                  onChange={handleChange}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Metric (cm, kg)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="measurementUnit"
                  value="imperial"
                  checked={formData.measurementUnit === 'imperial'}
                  onChange={handleChange}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Imperial (in, lbs)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Activity & Experience */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Activity className="w-4 h-4 text-emerald-600" />
            Activity & Fitness Experience
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Daily Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (Desk job, minimal activity)</option>
                <option value="lightly_active">Lightly Active (1-2 days/week)</option>
                <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week intense)</option>
                <option value="extra_active">Extra Active (Athlete / physical labor)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Fitness Experience Level
              </label>
              <select
                name="fitnessExperience"
                value={formData.fitnessExperience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="beginner">Beginner (Under 1 year experience)</option>
                <option value="intermediate">Intermediate (1-3 years experience)</option>
                <option value="advanced">Advanced (3+ years consistent training)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2.5">
              Preferred Workout Styles
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {workoutOptions.map((type) => {
                const selected = formData.preferredWorkoutTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleWorkoutType(type)}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-1 ring-emerald-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2.5">
              Dietary Preferences
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {dietOptions.map((diet) => {
                const selected = formData.dietaryPreferences.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDietaryPref(diet)}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-1 ring-emerald-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {diet}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-sm cursor-pointer"
          >
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
