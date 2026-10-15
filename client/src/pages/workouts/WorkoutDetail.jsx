import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Dumbbell,
  ArrowLeft,
  Clock,
  Calendar,
  Play,
  Edit2,
  Trash2,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { getWorkoutById, deleteWorkout } from '../../api/workouts';
import { createWorkoutCompletion } from '../../api/completions';
import { createSchedule } from '../../api/schedule';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('08:00');

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logDuration, setLogDuration] = useState('45');
  const [logCalories, setLogCalories] = useState('');
  const [logNotes, setLogNotes] = useState('');

  const fetchWorkout = async () => {
    try {
      const res = await getWorkoutById(id);
      setWorkout(res?.data || null);
      if (res?.data?.estimatedDuration) {
        setLogDuration(String(res.data.estimatedDuration));
      }
    } catch (err) {
      notify('Routine not found or access denied.', 'error');
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteWorkout(id);
      notify('Routine deleted.', 'success');
      navigate('/workouts');
    } catch (err) {
      notify('Failed to delete routine.', 'error');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSchedule({
        workoutId: id,
        scheduledDate,
        scheduledTime,
      });
      notify(`"${workout.name}" scheduled for ${scheduleDate}!`, 'success');
      setScheduleModalOpen(false);
    } catch (err) {
      notify('Error scheduling workout.', 'error');
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWorkoutCompletion({
        workoutId: id,
        workoutName: workout.name,
        durationMinutes: Number(logDuration),
        caloriesBurned: logCalories ? Number(logCalories) : null,
        notes: logNotes,
        exercisesCompleted: (workout.exercises || []).map((ex) => ({
          name: ex.name,
          setsCompleted: ex.sets,
          repsCompleted: ex.reps,
          weightUsed: ex.weight || 0,
        })),
      });
      notify(`Session logged! Great job completing "${workout.name}".`, 'success');
      setLogModalOpen(false);
    } catch (err) {
      notify('Error logging workout completion.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading routine..." />;
  }

  if (!workout) return null;

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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {workout.workoutType}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{workout.estimatedDuration} mins
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{workout.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Log Completion</span>
            </button>
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Schedule</span>
            </button>
            <Link
              to={`/workouts/edit/${workout._id}`}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
              title="Edit Routine"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="p-2 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
              title="Delete Routine"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {workout.description && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 leading-relaxed">
          {workout.description}
        </div>
      )}

      {/* Exercises Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Exercise Breakdown ({workout.exercises?.length || 0} exercises)
        </h3>

        <div className="divide-y divide-slate-100">
          {(workout.exercises || []).map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Rest: {item.restInterval || 60} seconds between sets
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">
                  {item.sets} sets × {item.reps} reps
                </div>
                {item.weight ? (
                  <div className="text-xs text-emerald-600 font-semibold">{item.weight} kg</div>
                ) : (
                  <div className="text-xs text-slate-400">Bodyweight / standard</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={`Schedule "${workout.name}"`}
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Select Date *
            </label>
            <input
              type="date"
              required
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Time (Optional)
            </label>
            <input
              type="text"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              placeholder="e.g. 07:00 AM"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Completed Session Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title={`Record Workout: "${workout.name}"`}
      >
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Log your actual workout completion. This record updates your statistics and syncs with frequency goals.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={logDuration}
                onChange={(e) => setLogDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Calories Burned (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={logCalories}
                onChange={(e) => setLogCalories(e.target.value)}
                placeholder="e.g. 320"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              rows="3"
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="Felt great, completed all repetitions..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setLogModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs"
            >
              Log Completion
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Workout Routine"
        message={`Are you sure you want to delete "${workout.name}"? Completed logs will remain safe.`}
        confirmText="Delete Routine"
      />
    </div>
  );
};
