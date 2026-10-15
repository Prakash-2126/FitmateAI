import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Play,
} from 'lucide-react';
import { getWorkouts, deleteWorkout } from '../../api/workouts';
import { createWorkoutCompletion } from '../../api/completions';
import { createSchedule } from '../../api/schedule';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const WorkoutsList = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Action Modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [workoutToSchedule, setWorkoutToSchedule] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('08:00');

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [workoutToLog, setWorkoutToLog] = useState(null);
  const [logDuration, setLogDuration] = useState('45');
  const [logCalories, setLogCalories] = useState('');
  const [logNotes, setLogNotes] = useState('');

  const fetchWorkoutsList = async () => {
    try {
      const res = await getWorkouts();
      setWorkouts(res?.data || []);
    } catch (err) {
      notify('Failed to load workout routines.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutsList();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!workoutToDelete) return;
    try {
      await deleteWorkout(workoutToDelete._id);
      notify('Workout routine removed.', 'success');
      setDeleteDialogOpen(false);
      fetchWorkoutsList();
    } catch (err) {
      notify('Failed to delete workout.', 'error');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!workoutToSchedule || !scheduleDate) return;
    try {
      await createSchedule({
        workoutId: workoutToSchedule._id,
        scheduledDate: scheduleDate,
        scheduledTime: scheduleTime,
      });
      notify(`"${workoutToSchedule.name}" scheduled for ${scheduleDate}!`, 'success');
      setScheduleModalOpen(false);
    } catch (err) {
      notify(err.response?.data?.message || 'Error scheduling workout.', 'error');
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!workoutToLog || !logDuration) return;
    try {
      await createWorkoutCompletion({
        workoutId: workoutToLog._id,
        workoutName: workoutToLog.name,
        durationMinutes: Number(logDuration),
        caloriesBurned: logCalories ? Number(logCalories) : null,
        notes: logNotes,
      });
      notify(`Great workout! "${workoutToLog.name}" completion recorded.`, 'success');
      setLogModalOpen(false);
    } catch (err) {
      notify(err.response?.data?.message || 'Error recording workout session.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading workouts..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Workout Routines</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Design reusable training templates, schedule sessions, and track completed workouts.
          </p>
        </div>

        <Link
          to="/workouts/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Routine</span>
        </Link>
      </div>

      {/* Routine Cards Grid */}
      {workouts.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No workout routines found"
          description="Create structured training routines tailored to your fitness objectives."
          actionText="Build Your First Routine"
          onAction={() => navigate('/workouts/create')}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => {
            const typeColor =
              workout.workoutType?.toLowerCase().includes('strength')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : workout.workoutType?.toLowerCase().includes('cardio')
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : workout.workoutType?.toLowerCase().includes('hiit')
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-purple-50 text-purple-800 border-purple-200';

            return (
              <div
                key={workout._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeColor}`}>
                      {workout.workoutType}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        onClick={() => navigate(`/workouts/edit/${workout._id}`)}
                        className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title="Edit Routine"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setWorkoutToDelete(workout);
                          setDeleteDialogOpen(true);
                        }}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <Link
                    to={`/workouts/${workout._id}`}
                    className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors block mb-1.5 line-clamp-1"
                  >
                    {workout.name}
                  </Link>

                  {workout.description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {workout.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{workout.estimatedDuration || 45} mins
                    </span>
                    <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {workout.exercises?.length || 0} exercises
                    </span>
                  </div>

                  {/* Exercises preview pills */}
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="space-y-1.5 mb-5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                        Included Exercises:
                      </span>
                      {workout.exercises.slice(0, 3).map((ex, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-700 font-medium">
                          <span className="truncate max-w-[170px] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {ex.name}
                          </span>
                          <span className="text-slate-400 font-normal text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-100">
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="text-[11px] text-emerald-600 font-semibold pt-1">
                          +{workout.exercises.length - 3} more exercise(s)
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setWorkoutToLog(workout);
                      setLogDuration(String(workout.estimatedDuration || 45));
                      setLogModalOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Log Workout</span>
                  </button>
                  <button
                    onClick={() => {
                      setWorkoutToSchedule(workout);
                      setScheduleModalOpen(true);
                    }}
                    className="p-2.5 border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 text-slate-600 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
                    title="Schedule on Calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/workouts/${workout._id}`}
                    className="p-2.5 border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 text-slate-600 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={`Schedule "${workoutToSchedule?.name}"`}
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
              placeholder="e.g. 07:30 AM"
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
              Add to Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Completed Session Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title={`Record Workout: "${workoutToLog?.name}"`}
      >
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Log your actual workout completion. This record directly informs your analytics, frequency goals, and progress charts.
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
                placeholder="e.g. 350"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Session Notes
            </label>
            <textarea
              rows="3"
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="Felt strong on bench press, increased load by 2.5 kg..."
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
              Save Workout Completion
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Workout Routine"
        message={`Are you sure you want to delete "${workoutToDelete?.name}"? Completed session records will remain intact.`}
        confirmText="Delete Routine"
      />
    </div>
  );
};
