import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Flame,
  Search,
  Edit2,
  Trash2,
  History,
  Sunrise,
  Sun,
  Moon,
  Coffee,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { getMeals, createMeal, updateMeal, deleteMeal } from '../../api/meals';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const DietOverview = () => {
  const { notify } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    time: '08:00',
    foodDescription: '',
    quantity: '1 serving',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    notes: '',
  });

  const fetchMealsForDate = async (dateStr) => {
    setLoading(true);
    try {
      const res = await getMeals({ date: dateStr, search });
      setMeals(res?.data || []);
      setTotals(res?.totals || { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
    } catch (err) {
      notify('Failed to load meals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsForDate(selectedDate);
  }, [selectedDate, search]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleOpenAdd = (category = 'Breakfast') => {
    setEditingMeal(null);
    setFormData({
      name: '',
      category,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      foodDescription: '',
      quantity: '',
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      category: meal.category,
      time: meal.time || '',
      foodDescription: meal.foodDescription || '',
      quantity: meal.quantity || '',
      calories: meal.calories !== null ? meal.calories : '',
      protein: meal.protein !== null ? meal.protein : '',
      carbohydrates: meal.carbohydrates !== null ? meal.carbohydrates : '',
      fat: meal.fat !== null ? meal.fat : '',
      notes: meal.notes || '',
    });
    setModalOpen(true);
  };

  const handleSaveMeal = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notify('Meal name is required.', 'error');
      return;
    }

    try {
      const payload = {
        ...formData,
        date: selectedDate,
      };

      if (editingMeal) {
        await updateMeal(editingMeal._id, payload);
        notify('Meal updated successfully!', 'success');
      } else {
        await createMeal(payload);
        notify('Meal logged successfully!', 'success');
      }

      setModalOpen(false);
      fetchMealsForDate(selectedDate);
    } catch (err) {
      notify(err.response?.data?.message || 'Error saving meal.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!mealToDelete) return;
    try {
      await deleteMeal(mealToDelete._id);
      notify('Meal removed.', 'success');
      setDeleteDialogOpen(false);
      fetchMealsForDate(selectedDate);
    } catch (err) {
      notify('Failed to delete meal.', 'error');
    }
  };

  const categories = [
    { name: 'Breakfast', icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
    { name: 'Lunch', icon: Sun, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
    { name: 'Dinner', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
    { name: 'Snack', icon: Coffee, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  ];

  // Calculate rough macro distribution percentages
  const totalGrams = (totals.protein || 0) + (totals.carbohydrates || 0) + (totals.fat || 0);
  const proteinPct = totalGrams > 0 ? Math.round(((totals.protein || 0) / totalGrams) * 100) : 0;
  const carbsPct = totalGrams > 0 ? Math.round(((totals.carbohydrates || 0) / totalGrams) * 100) : 0;
  const fatPct = totalGrams > 0 ? Math.round(((totals.fat || 0) / totalGrams) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nutrition & Meal Tracker</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daily Nutrition Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Record meals to automatically compute calories and macronutrient ratios from verified food entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/diet/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200 shadow-2xs transition-all hover:scale-[1.02]"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Meal History</span>
          </Link>
          <button
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-2xl shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Meal</span>
          </button>
        </div>
      </div>

      {/* Date Bar & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrevDay}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleNextDay}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logged foods or meals..."
            className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Daily Nutritional Summary Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Total Calories Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Energy</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-black tracking-tight text-white">{totals.calories}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Kilocalories Logged Today</div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Verified entries</span>
            <span className="text-emerald-400 font-semibold">{meals.length} meal items</span>
          </div>
        </div>

        {/* Macronutrient Gauges */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Protein */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Protein</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {proteinPct}% ratio
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{totals.protein}g</div>
              <p className="text-xs text-slate-400">Muscle recovery & synthesis</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(proteinPct * 1.5, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Carbohydrates</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  {carbsPct}% ratio
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{totals.carbohydrates}g</div>
              <p className="text-xs text-slate-400">Primary workout energy</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(carbsPct * 1.5, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fat */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dietary Fat</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                  {fatPct}% ratio
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{totals.fat}g</div>
              <p className="text-xs text-slate-400">Hormonal health & vitamins</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(fatPct * 1.5, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Meal Sections */}
      {loading ? (
        <LoadingSpinner size="md" text="Loading logged meals..." />
      ) : (
        <div className="space-y-6">
          {categories.map((catObj) => {
            const category = catObj.name;
            const CategoryIcon = catObj.icon;
            const categoryMeals = meals.filter((m) => m.category === category);
            const catCals = categoryMeals.reduce((s, m) => s + (m.calories || 0), 0);
            const catProtein = categoryMeals.reduce((s, m) => s + (m.protein || 0), 0);

            return (
              <div
                key={category}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${catObj.bg}`}>
                      <CategoryIcon className={`w-5 h-5 ${catObj.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{category}</h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {categoryMeals.length} item{categoryMeals.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {catCals > 0 ? `${catCals} kcal • ${catProtein}g protein` : 'No calories recorded'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAdd(category)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {category}</span>
                  </button>
                </div>

                {categoryMeals.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    No items recorded for {category.toLowerCase()} yet. Click "Add {category}" to log food.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {categoryMeals.map((meal) => (
                      <div
                        key={meal._id}
                        className="py-3.5 flex items-start sm:items-center justify-between gap-4 group hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{meal.name}</span>
                            {meal.quantity && (
                              <span className="text-xs text-slate-500 font-medium px-2 py-0.5 rounded-md bg-slate-100">
                                {meal.quantity}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            {meal.time && (
                              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                {meal.time}
                              </span>
                            )}
                            {meal.foodDescription && <span>{meal.foodDescription}</span>}
                          </div>
                          {meal.notes && (
                            <div className="text-[11px] text-slate-400 italic mt-1">
                              Note: {meal.notes}
                            </div>
                          )}
                        </div>

                        {/* Nutrition pill badges */}
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-slate-900">
                            {meal.calories !== null ? `${meal.calories} kcal` : '—'}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-end mt-1 font-medium">
                            {meal.protein !== null && (
                              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                P: {meal.protein}g
                              </span>
                            )}
                            {meal.carbohydrates !== null && (
                              <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                C: {meal.carbohydrates}g
                              </span>
                            )}
                            {meal.fat !== null && (
                              <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                                F: {meal.fat}g
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 pl-2">
                          <button
                            onClick={() => handleOpenEdit(meal)}
                            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            title="Edit Meal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setMealToDelete(meal);
                              setDeleteDialogOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Meal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Meal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMeal ? 'Edit Logged Meal' : 'Log a Meal'}
      >
        <form onSubmit={handleSaveMeal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Meal / Food Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Scrambled Eggs & Toast"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 08:30"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Portion / Quantity
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 2 eggs, 1 slice"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Calories (kcal) (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="e.g. 350"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Macros */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.carbohydrates}
                onChange={(e) => setFormData({ ...formData, carbohydrates: e.target.value })}
                placeholder="e.g. 30"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                placeholder="e.g. 12"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Food Description / Ingredients
            </label>
            <input
              type="text"
              value={formData.foodDescription}
              onChange={(e) => setFormData({ ...formData, foodDescription: e.target.value })}
              placeholder="e.g. Whole wheat toast, olive oil butter, 2 large eggs"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Felt energetic, plenty of water..."
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
              {editingMeal ? 'Update Meal' : 'Save Meal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Logged Meal"
        message={`Are you sure you want to delete "${mealToDelete?.name}"?`}
        confirmText="Delete"
      />
    </div>
  );
};
