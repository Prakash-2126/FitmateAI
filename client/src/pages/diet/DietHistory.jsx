import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { getMeals } from '../../api/meals';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const DietHistory = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
      };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;

      const res = await getMeals(params);
      setMeals(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      setTotalCount(res?.totalCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/diet"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Daily Tracker</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Diet & Meal History</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Search, filter, and inspect all previously recorded meals across your account.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meal name..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>

          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {totalCount} total logged
          </span>
        </div>
      </div>

      {/* Meals Table / List */}
      {loading ? (
        <LoadingSpinner size="md" text="Loading meal history..." />
      ) : meals.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="No meals match your filter"
          description="Try broadening your search term or category selection."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategory('');
            setPage(1);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Meal Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6 text-right">Calories</th>
                  <th className="py-3.5 px-6 text-right">Macronutrients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meals.map((meal) => (
                  <tr key={meal._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-500">
                      {new Date(meal.date).toLocaleDateString()} {meal.time ? `• ${meal.time}` : ''}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      <div>{meal.name}</div>
                      {meal.quantity && (
                        <div className="text-xs text-slate-400 font-normal">{meal.quantity}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {meal.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {meal.calories ? `${meal.calories} kcal` : '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right text-xs text-slate-500">
                      {meal.protein || meal.carbohydrates || meal.fat ? (
                        <span>
                          {meal.protein ? `P: ${meal.protein}g ` : ''}
                          {meal.carbohydrates ? `C: ${meal.carbohydrates}g ` : ''}
                          {meal.fat ? `F: ${meal.fat}g` : ''}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
