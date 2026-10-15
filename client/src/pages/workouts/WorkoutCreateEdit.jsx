import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Dumbbell,
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Clock,
  Layers,
  Save,
  Search,
} from 'lucide-react';
import { getWorkoutById, createWorkout, updateWorkout } from '../../api/workouts';
import { getExercises } from '../../api/exercises';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';

export const WorkoutCreateEdit = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workoutType: 'Strength',
    estimatedDuration: 45,
    exercises: [],
  });

  // Exercise Picker Modal
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [libraryExercises, setLibraryExercises] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchRoutine = async () => {
        try {
          const res = await getWorkoutById(id);
          if (res?.data) {
            const w = res.data;
            setFormData({
              name: w.name,
              description: w.description || '',
              workoutType: w.workoutType || 'Strength',
              estimatedDuration: w.estimatedDuration || 45,
              exercises: w.exercises || [],
            });
          }
        } catch (err) {
          notify('Failed to load workout routine.', 'error');
          navigate('/workouts');
        } finally {
          setLoading(false);
        }
      };
      fetchRoutine();
    }
  }, [id, isEditMode]);

  const loadExerciseLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await getExercises({ search: exerciseSearch });
      setLibraryExercises(res?.data || []);
    } catch (err) {
      notify('Failed to load library exercises.', 'error');
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleOpenLibrary = () => {
    setExerciseModalOpen(true);
    loadExerciseLibrary();
  };

  const handleAddExerciseFromLibrary = (exercise) => {
    const newItem = {
      exercise: exercise._id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      weight: '',
      duration: '',
      restInterval: 60,
      order: formData.exercises.length,
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newItem],
    }));
    setExerciseModalOpen(false);
    notify(`Added "${exercise.name}" to routine.`, 'success');
  };

  const handleAddCustomExercise = () => {
    const newItem = {
      name: 'Custom Exercise',
      sets: 3,
      reps: 10,
      weight: '',
      duration: '',
      restInterval: 60,
      order: formData.exercises.length,
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newItem],
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.exercises];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, exercises: updated };
    });
  };

  const handleRemoveExercise = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleMoveExercise = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.exercises.length) return;

    setFormData((prev) => {
      const updated = [...prev.exercises];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      return { ...prev, exercises: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notify('Routine name is required.', 'error');
      return;
    }

    if (formData.exercises.length === 0) {
      notify('Please add at least one exercise to the routine.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isEditMode) {
        await updateWorkout(id, formData);
        notify('Workout routine updated!', 'success');
      } else {
        await createWorkout(formData);
        notify('Workout routine created successfully!', 'success');
      }
      navigate('/workouts');
    } catch (err) {
      notify(err.response?.data?.message || 'Error saving routine.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading routine details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/workouts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Routines</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isEditMode ? 'Edit Workout Routine' : 'Create New Workout Routine'}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Assemble exercises, specify set volumes, and organize your training session.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Routine Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-600" />
            Routine Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Routine Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Upper Body Strength & Hypertrophy"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Workout Type
              </label>
              <select
                value={formData.workoutType}
                onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Full Body">Full Body</option>
                <option value="Split">Split</option>
                <option value="Yoga/Mobility">Yoga & Mobility</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Routine Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Focus on controlled tempo and full range of motion..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Exercise List Builder */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Exercise Sequence ({formData.exercises.length})
              </h3>
              <p className="text-xs text-slate-500">Configure sets, reps, weight, and rest</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenLibrary}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Select from Library</span>
              </button>
              <button
                type="button"
                onClick={handleAddCustomExercise}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                + Custom Name
              </button>
            </div>
          </div>

          {formData.exercises.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <Dumbbell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No exercises added yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Click "Select from Library" above to pick movements from the catalog.
              </p>
              <button
                type="button"
                onClick={handleOpenLibrary}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Browse Exercise Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.exercises.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                        className="font-bold text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-500 focus:bg-white px-1 py-0.5 w-full max-w-sm rounded"
                      />
                    </div>

                    {/* Reorder and Delete controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveExercise(idx, -1)}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.exercises.length - 1}
                        onClick={() => handleMoveExercise(idx, 1)}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Param Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Sets</label>
                      <input
                        type="number"
                        min="1"
                        value={item.sets}
                        onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Reps</label>
                      <input
                        type="number"
                        min="1"
                        value={item.reps}
                        onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Target Load (kg)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.weight || ''}
                        onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
                        placeholder="Optional"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Rest Interval (s)</label>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={item.restInterval}
                        onChange={(e) => handleExerciseChange(idx, 'restInterval', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEditMode ? 'Update Routine' : 'Create Routine'}</span>
          </button>
        </div>
      </form>

      {/* Library Selector Modal */}
      <Modal
        isOpen={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        title="Select Exercise from Catalog"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadExerciseLibrary()}
              placeholder="Search exercise by name..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {loadingLibrary ? (
            <LoadingSpinner size="sm" text="Searching exercises..." />
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {libraryExercises.map((ex) => (
                <div
                  key={ex._id}
                  onClick={() => handleAddExerciseFromLibrary(ex)}
                  className="py-2.5 px-2 hover:bg-emerald-50 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{ex.name}</h5>
                    <p className="text-[11px] text-slate-400">
                      {ex.muscleGroup} • {ex.equipment}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    + Add
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
