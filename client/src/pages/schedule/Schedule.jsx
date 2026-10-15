import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  ArrowRight,
  Trash2,
  CalendarDays,
  Dumbbell,
} from 'lucide-react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../api/schedule';
import { getWorkouts } from '../../api/workouts';
import { createWorkoutCompletion } from '../../api/completions';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const Schedule = () => {
  const { notify } = useNotification();
  const [schedules, setSchedules] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Quick completion modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [scheduleToComplete, setScheduleToComplete] = useState(null);
  const [duration, setDuration] = useState('45');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const [formData, setFormData] = useState({
    workoutId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '08:00',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [schedRes, workoutRes] = await Promise.all([
        getSchedules(),
        getWorkouts(),
      ]);
      setSchedules(schedRes?.data || []);
      setWorkouts(workoutRes?.data || []);
      if (workoutRes?.data?.length > 0 && !formData.workoutId) {
        setFormData((prev) => ({ ...prev, workoutId: workoutRes.data[0]._id }));
      }
    } catch (err) {
      notify('Failed to load schedule.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setFormData({
      workoutId: workouts[0]?._id || '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '08:00',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!formData.workoutId) {
      notify('Please select a workout routine.', 'error');
      return;
    }

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule._id, {
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
          notes: formData.notes,
        });
        notify('Schedule updated!', 'success');
      } else {
        await createSchedule(formData);
        notify('Workout added to calendar!', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      notify(err.response?.data?.message || 'Error saving schedule.', 'error');
    }
  };

  const handleOpenCompleteModal = (item) => {
    setScheduleToComplete(item);
    setDuration(String(item.workout?.estimatedDuration || 45));
    setCalories('');
    setNotes('');
    setCompleteModalOpen(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleToComplete) return;

    try {
      await createWorkoutCompletion({
        workoutId: scheduleToComplete.workout?._id,
        workoutName: scheduleToComplete.workout?.name || 'Workout Session',
        durationMinutes: Number(duration),
        caloriesBurned: calories ? Number(calories) : null,
        scheduleId: scheduleToComplete._id,
        notes: notes,
      });

      notify('Workout marked complete and logged!', 'success');
      setCompleteModalOpen(false);
      fetchData();
    } catch (err) {
      notify('Error recording completion.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteSchedule(scheduleToDelete._id);
      notify('Scheduled session removed.', 'success');
      setDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      notify('Failed to delete scheduled session.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading schedule..." />;
  }

  // Group schedules by Date
  const groupedSchedules = schedules.reduce((acc, item) => {
    const dStr = new Date(item.scheduledDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    if (!acc[dStr]) acc[dStr] = [];
    acc[dStr].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Workout Schedule</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Plan your training sessions across the calendar and record completions effortlessly.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={workouts.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Workout</span>
        </button>
      </div>

      {workouts.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>You need at least one workout routine to schedule workouts on the calendar.</span>
          <Link
            to="/workouts/create"
            className="font-bold underline text-amber-800 hover:text-amber-950"
          >
            Create Routine First
          </Link>
        </div>
      )}

      {/* Schedule List */}
      {schedules.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No scheduled workouts"
          description="Build consistency by planning your workout sessions for the week ahead."
          actionText={workouts.length > 0 ? 'Schedule a Workout Now' : 'Create Routine First'}
          onAction={() =>
            workouts.length > 0 ? handleOpenCreate() : (window.location.href = '/workouts/create')
          }
          actionIcon={Plus}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedules).map(([dateLabel, items]) => (
            <div key={dateLabel} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{dateLabel}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 ml-auto">
                  {items.length} session{items.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const isCompleted = item.status === 'completed';

                  return (
                    <div
                      key={item._id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCompleted
                          ? 'border-emerald-200/80 bg-emerald-50/30'
                          : 'border-slate-200/70 bg-slate-50/60 hover:bg-white hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-sky-50 text-sky-800 border-sky-200'
                            }`}
                          >
                            {item.status}
                          </span>
                          <h4 className="text-base font-bold text-slate-900">
                            {item.workout?.name || 'Workout Session'}
                          </h4>
                        </div>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.scheduledTime || 'Flexible Time'}
                          </span>
                          <span>•</span>
                          <span>~{item.workout?.estimatedDuration || 45} mins</span>
                          {item.notes && (
                            <>
                              <span>•</span>
                              <span className="italic text-slate-400">"{item.notes}"</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isCompleted && (
                          <button
                            onClick={() => handleOpenCompleteModal(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Mark Complete</span>
                          </button>
                        )}

                        {item.workout?._id && (
                          <Link
                            to={`/workouts/${item.workout._id}`}
                            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                          >
                            View Routine
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setScheduleToDelete(item);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove from Calendar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Workout on Calendar"
      >
        <form onSubmit={handleSaveSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Select Workout Routine *
            </label>
            <select
              required
              value={formData.workoutId}
              onChange={(e) => setFormData({ ...formData, workoutId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {workouts.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} ({w.workoutType} • ~{w.estimatedDuration} mins)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Time (Optional)
              </label>
              <input
                type="text"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                placeholder="e.g. 07:00 AM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Gym with partner, focus on legs..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
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

      {/* Complete Workout Modal */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Complete & Log Workout Session"
      >
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Mark "{scheduleToComplete?.workout?.name}" as finished and log your active minutes.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Duration (Mins) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Calories (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
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
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Felt great, completed all sets on schedule..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCompleteModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs"
            >
              Save Completed Workout
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Scheduled Workout"
        message="Remove this scheduled session from your calendar?"
        confirmText="Remove"
      />
    </div>
  );
};
