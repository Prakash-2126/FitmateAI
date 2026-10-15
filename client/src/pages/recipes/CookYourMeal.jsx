import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Play,
  Utensils,
  Flame,
  Clock,
  Sparkles,
  Plus,
  Check,
  CheckCircle2,
  Leaf,
  Drumstick,
  Search,
  X,
  Layers,
  Scale,
  RotateCcw,
  Award,
  Video,
  ChevronRight,
} from 'lucide-react';
import { getRecipes, logRecipeToMeal } from '../../api/recipes';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';

export const CookYourMeal = () => {
  const { notify } = useNotification();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dietaryType, setDietaryType] = useState('All'); // 'All', 'Vegetarian', 'Non-Vegetarian'
  const [mealType, setMealType] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  // Active Modals
  const [activeVideoRecipe, setActiveVideoRecipe] = useState(null);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);
  const [loggingId, setLoggingId] = useState(null);
  const [loggedIds, setLoggedIds] = useState([]);

  const fetchRecipesList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dietaryType !== 'All') params.dietaryType = dietaryType;
      if (mealType !== 'All') params.mealType = mealType;
      if (search.trim()) params.search = search.trim();
      if (sort === 'protein_desc') params.sort = 'protein_desc';
      if (sort === 'calories_asc') params.sort = 'calories_asc';
      if (sort === 'time_asc') params.sort = 'time_asc';

      const res = await getRecipes(params);
      setRecipes(res?.data || []);
    } catch (err) {
      notify('Failed to load diet-friendly recipes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipesList();
  }, [dietaryType, mealType, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipesList();
  };

  const handleResetFilters = () => {
    setDietaryType('All');
    setMealType('All');
    setSearch('');
    setSort('featured');
  };

  const handleLogToDiet = async (recipe, e) => {
    if (e) e.stopPropagation();
    if (loggingId) return;

    setLoggingId(recipe._id);
    try {
      const res = await logRecipeToMeal(recipe._id);
      notify(res?.message || `"${recipe.title}" added to your diet log!`, 'success');
      setLoggedIds((prev) => [...prev, recipe._id]);
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to log recipe to meals.', 'error');
    } finally {
      setLoggingId(null);
    }
  };

  const mealTypes = [
    { label: 'All Meals', value: 'All' },
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Meal Prep', value: 'Meal Prep' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto page-transition">
      {/* Page Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden animate-fade-up card-shine">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <ChefHat className="w-3.5 h-3.5" />
            <span>FitMate AI Culinary Studio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Cook Your Meal — Diet Friendly Recipes
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Follow step-by-step HD video guides for high-protein, calorie-conscious meals. 
            Designed specifically for gym enthusiasts and weight-loss goals across 
            both <strong className="text-emerald-400">Vegetarian</strong> and <strong className="text-amber-400">Non-Vegetarian</strong> preferences.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              100% In-Website Video Streaming
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              1-Click Log to Diet Tracker
            </span>
          </div>
        </div>

        {/* Quick Macro & Stats Highlights */}
        <div className="relative z-10 grid grid-cols-2 gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
            <div className="text-2xl font-black text-emerald-400">{recipes.length}</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Healthy Recipes
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
            <div className="text-2xl font-black text-teal-300">30g - 54g</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Protein / Serving
            </div>
          </div>
        </div>
      </div>

      {/* Dietary Type Filter Switcher (Primary Toggle) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            Dietary Preference:
          </span>
          <span className="text-slate-400 font-normal lowercase">
            showing {recipes.length} meal{recipes.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* All */}
          <button
            onClick={() => setDietaryType('All')}
            className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              dietaryType === 'All'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30 ring-2 ring-emerald-500/50'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-500" />
            <span>All Diet Recipes</span>
          </button>

          {/* Vegetarian & Vegan */}
          <button
            onClick={() => setDietaryType('Vegetarian')}
            className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              dietaryType === 'Vegetarian'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/80 hover:border-emerald-300'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-500 fill-emerald-500 animate-bounce-subtle" />
            <span>🥬 Vegetarian & Vegan</span>
          </button>

          {/* Non-Vegetarian */}
          <button
            onClick={() => setDietaryType('Non-Vegetarian')}
            className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              dietaryType === 'Non-Vegetarian'
                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'bg-amber-50/60 text-amber-900 hover:bg-amber-100/70 border border-amber-200/80 hover:border-amber-300'
            }`}
          >
            <Drumstick className="w-4 h-4 text-amber-600 animate-bounce-subtle" />
            <span>🍗 Non-Vegetarian</span>
          </button>
        </div>
      </div>

      {/* Search and Secondary Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search healthy recipes by title, ingredient (e.g. paneer, chicken, oats, salmon, shrimp)..."
            className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Meal Type Pills & Sort Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Meal Types */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Meal:
            </span>
            {mealTypes.map((mt) => (
              <button
                key={mt.value}
                onClick={() => setMealType(mt.value)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  mealType === mt.value
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mt.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-semibold text-slate-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="featured">Featured First</option>
              <option value="protein_desc">Highest Protein (g)</option>
              <option value="calories_asc">Lowest Calories</option>
              <option value="time_asc">Quickest Cook Time</option>
            </select>
          </div>

          {(dietaryType !== 'All' || mealType !== 'All' || search || sort !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <LoadingSpinner size="md" text="Loading culinary video guides..." />
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={ChefHat}
          title="No recipes found"
          description="Try selecting a different diet category or clearing your search keywords."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => {
            const isVeg = recipe.dietaryType === 'Vegetarian' || recipe.dietaryType === 'Vegan';
            const isLogged = loggedIds.includes(recipe._id);
            const isLoggingThis = loggingId === recipe._id;

            return (
              <div
                key={recipe._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-emerald-300 card-hover-lift card-shine animate-fade-up flex flex-col justify-between overflow-hidden group"
                style={{ animationDelay: `${(index % 6) * 60}ms` }}
              >
                {/* Recipe Video Thumbnail */}
                <div
                  className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => setActiveVideoRecipe(recipe)}
                >
                  <img
                    src={recipe.thumbnailUrl || `https://img.youtube.com/vi/${recipe.youtubeId}/hqdefault.jpg`}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 backdrop-blur-md group-hover:scale-125 group-hover:bg-emerald-400 group-hover:shadow-emerald-500/50 transition-all duration-300">
                      <Play className="w-6 h-6 fill-white ml-0.5 text-white animate-bounce-subtle" />
                    </div>
                  </div>

                  {/* Dietary Badge (Top Left) */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                        isVeg
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {isVeg ? '🥬 Vegetarian' : '🍗 Non-Veg'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 text-slate-200 text-[10px] font-semibold backdrop-blur-md">
                      {recipe.mealType}
                    </span>
                  </div>

                  {/* Cook & Prep Time (Bottom Left) */}
                  <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-slate-200 flex items-center gap-1 drop-shadow-md">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins total ({recipe.cookTimeMinutes}m cook)
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => setSelectedRecipeDetail(recipe)}
                      className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 mb-1.5"
                    >
                      {recipe.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {recipe.description}
                    </p>

                    {/* Macro Breakdown Pills */}
                    <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                      <div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase">Cals</div>
                        <div className="text-xs font-black text-slate-800">{recipe.calories}</div>
                      </div>
                      <div className="border-l border-slate-200">
                        <div className="text-[10px] font-semibold text-emerald-600 uppercase">Protein</div>
                        <div className="text-xs font-black text-emerald-700">{recipe.protein}g</div>
                      </div>
                      <div className="border-l border-slate-200">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase">Carbs</div>
                        <div className="text-xs font-bold text-slate-700">{recipe.carbs}g</div>
                      </div>
                      <div className="border-l border-slate-200">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase">Fats</div>
                        <div className="text-xs font-bold text-slate-700">{recipe.fats}g</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setActiveVideoRecipe(recipe)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch & Cook</span>
                    </button>

                    <button
                      onClick={(e) => handleLogToDiet(recipe, e)}
                      disabled={isLoggingThis || isLogged}
                      className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1 shrink-0 ${
                        isLogged
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                      }`}
                      title="Log this recipe to today's diet tracker"
                    >
                      {isLogged ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Logged</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Log Meal</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedRecipeDetail(recipe)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors"
                      title="View full ingredients & instructions"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 🎬 DEDICATED IN-WEBSITE YOUTUBE COOKING VIDEO MODAL      */}
      {/* ======================================================== */}
      {activeVideoRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {activeVideoRecipe.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeVideoRecipe.dietaryType} • {activeVideoRecipe.mealType} • {activeVideoRecipe.calories} kcal ({activeVideoRecipe.protein}g protein)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveVideoRecipe(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded 16:9 YouTube Cooking Video */}
            <div className="relative aspect-video w-full bg-black shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideoRecipe.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={`${activeVideoRecipe.title} - Cooking Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Recipe Details & Cooking Steps Scrollable Area */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-50 flex-1">
              {/* Macro Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Calories</div>
                  <div className="text-lg font-black text-slate-900">{activeVideoRecipe.calories} kcal</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center shadow-2xs">
                  <div className="text-xs text-emerald-700 font-bold uppercase">Protein</div>
                  <div className="text-lg font-black text-emerald-800">{activeVideoRecipe.protein}g</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Carbohydrates</div>
                  <div className="text-lg font-black text-slate-900">{activeVideoRecipe.carbs}g</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Fats</div>
                  <div className="text-lg font-black text-slate-900">{activeVideoRecipe.fats}g</div>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  Required Ingredients ({activeVideoRecipe.ingredients?.length || 0})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeVideoRecipe.ingredients?.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="font-semibold text-slate-700">{ing.item}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{ing.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Directions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Step-by-Step Cooking Instructions
                </h4>

                <ol className="space-y-2.5">
                  {activeVideoRecipe.instructions?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleLogToDiet(activeVideoRecipe, e)}
                disabled={loggingId === activeVideoRecipe._id || loggedIds.includes(activeVideoRecipe._id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
              >
                {loggedIds.includes(activeVideoRecipe._id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Logged in Today's Diet</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Log to Today's Diet Tracker</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveVideoRecipe(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📋 RECIPE DETAIL MODAL                                   */}
      {/* ======================================================== */}
      <Modal
        isOpen={Boolean(selectedRecipeDetail)}
        onClose={() => setSelectedRecipeDetail(null)}
        title={selectedRecipeDetail?.title}
        subtitle={`${selectedRecipeDetail?.dietaryType} • ${selectedRecipeDetail?.mealType} • ${selectedRecipeDetail?.calories} kcal`}
      >
        {selectedRecipeDetail && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                {selectedRecipeDetail.dietaryType}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                {selectedRecipeDetail.calories} Calories • {selectedRecipeDetail.protein}g Protein
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedRecipeDetail.description}
            </p>

            {/* Ingredients */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Ingredients:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedRecipeDetail.ingredients?.map((ing, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-700">{ing.item}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Cooking Directions:
              </h4>
              <ol className="space-y-2">
                {selectedRecipeDetail.instructions?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const r = selectedRecipeDetail;
                  setSelectedRecipeDetail(null);
                  setActiveVideoRecipe(r);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Video Tutorial</span>
              </button>

              <button
                onClick={() => setSelectedRecipeDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
