import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Trash2,
  Edit2,
  RefreshCw,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  syncGoal,
} from '../../api/goals';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const Goals = () => {
  const { notify } = useNotification();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'workout_frequency',
    description: '',
    targetValue: '',
    unit: 'workouts/week',
    currentProgress: 0,
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
  });

  const fetchGoals = async () => {
    try {
      const res = await getGoals();
      setGoals(res?.data || []);
    } catch (err) {
      notify('Failed to load fitness goals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      category: 'workout_frequency',
      description: '',
      targetValue: '4',
      unit: 'workouts',
      currentProgress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      category: goal.category,
      description: goal.description || '',
      targetValue: goal.targetValue || '',
      unit: goal.unit || '',
      currentProgress: goal.currentProgress || 0,
      startDate: goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : '',
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      notify('Goal title is required.', 'error');
      return;
    }

    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, formData);
        notify('Goal updated successfully!', 'success');
      } else {
        await createGoal(formData);
        notify('Goal created successfully!', 'success');
      }
      setModalOpen(false);
      fetchGoals();
    } catch (err) {
      notify(err.response?.data?.message || 'Error saving goal.', 'error');
    }
  };

  const handleToggleStatus = async (goal, newStatus) => {
    try {
      await updateGoal(goal._id, { status: newStatus });
      notify(`Goal marked as ${newStatus}.`, 'success');
      fetchGoals();
    } catch (err) {
      notify('Failed to update status.', 'error');
    }
  };

  const handleSyncGoal = async (id) => {
    try {
      await syncGoal(id);
      notify('Synchronized progress from recorded workouts!', 'success');
      fetchGoals();
    } catch (err) {
      notify('Synchronization error.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!goalToDelete) return;
    try {
      await deleteGoal(goalToDelete._id);
      notify('Goal deleted successfully.', 'success');
      setDeleteDialogOpen(false);
      fetchGoals();
    } catch (err) {
      notify('Failed to delete goal.', 'error');
    }
  };

  const filteredGoals = goals.filter((g) => {
    if (filterStatus === 'all') return true;
    return g.status === filterStatus;
  });

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading goals..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fitness Goals</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Define objectives, measure consistency, and track progress calculated from real activity.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      {/* Status Filters */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {['all', 'active', 'completed', 'paused'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {st} ({goals.filter((g) => (st === 'all' ? true : g.status === st)).length})
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={filterStatus === 'all' ? 'No fitness goals created yet' : `No ${filterStatus} goals`}
          description="Create clear, measurable targets to keep yourself motivated and accountable."
          actionText="Create Your First Goal"
          onAction={handleOpenCreate}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const hasTarget = goal.targetValue && goal.targetValue > 0;
            const percentage = hasTarget
              ? Math.min(Math.round(((goal.currentProgress || 0) / goal.targetValue) * 100), 100)
              : null;
            const isCompleted = goal.status === 'completed';

            return (
              <div
                key={goal._id}
                className={`bg-white rounded-3xl border p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${
                  isCompleted
                    ? 'border-emerald-200/80 bg-emerald-50/15'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        goal.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : goal.status === 'paused'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-sky-50 text-sky-800 border-sky-200'
                      }`}
                    >
                      {goal.status}
                    </span>

                    <div className="flex items-center gap-1 text-slate-400">
                      {(goal.category === 'workout_frequency' ||
                        goal.category === 'exercise_consistency') && (
                        <button
                          onClick={() => handleSyncGoal(goal._id)}
                          title="Sync with workout records"
                          className="p-1.5 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(goal)}
                        className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title="Edit Goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setGoalToDelete(goal);
                          setDeleteDialogOpen(true);
                        }}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Indicator */}
                  {hasTarget && (
                    <div className="mt-4 mb-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-600">
                          {goal.currentProgress || 0} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="text-emerald-600 font-bold text-sm">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-700 shadow-xs"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {goal.targetDate && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-4 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Status Toggle Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {goal.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleToggleStatus(goal, 'completed')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all border border-emerald-200/60 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Achieved</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(goal, 'paused')}
                        className="inline-flex items-center justify-center p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs transition-colors border border-slate-200/60 cursor-pointer"
                        title="Pause Goal"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {goal.status === 'paused' && (
                    <button
                      onClick={() => handleToggleStatus(goal, 'active')}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume Goal</span>
                    </button>
                  )}

                  {goal.status === 'completed' && (
                    <button
                      onClick={() => handleToggleStatus(goal, 'active')}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>Reopen Goal</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? 'Edit Fitness Goal' : 'Create New Fitness Goal'}
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 4 Workouts Every Week"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="workout_frequency">Workout Frequency</option>
              <option value="exercise_consistency">Exercise Consistency</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="strength">Strength Progression</option>
              <option value="general_fitness">General Fitness</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Target Value
              </label>
              <input
                type="number"
                step="any"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                placeholder="e.g. 4 or 75"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. workouts, kg, mins"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {editingGoal && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Current Progress
              </label>
              <input
                type="number"
                step="any"
                value={formData.currentProgress}
                onChange={(e) => setFormData({ ...formData, currentProgress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why this goal matters and your action plan..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Fitness Goal"
        message={`Are you sure you want to delete "${goalToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Goal"
      />
    </div>
  );
};
