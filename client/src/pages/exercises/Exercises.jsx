import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Dumbbell,
  Play,
  Video,
  X,
  Sparkles,
  Flame,
  Award,
  Layers,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { getExercises, createCustomExercise } from '../../api/exercises';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';

export const Exercises = () => {
  const { notify } = useNotification();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [muscleGroup, setMuscleGroup] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [equipment, setEquipment] = useState('All');
  const [videosOnly, setVideosOnly] = useState(false);

  // Modals & Active Video Player
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [videoModalExercise, setVideoModalExercise] = useState(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const [customForm, setCustomForm] = useState({
    name: '',
    category: 'Strength',
    muscleGroup: 'Chest',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    videoUrl: '',
    description: '',
    instructions: '',
  });

  const fetchExercisesList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (muscleGroup !== 'All') params.muscleGroup = muscleGroup;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (equipment !== 'All') params.equipment = equipment;

      const res = await getExercises(params);
      let list = res?.data || [];

      if (videosOnly) {
        list = list.filter((e) => Boolean(e.youtubeId));
      }

      setExercises(list);
    } catch (err) {
      notify('Failed to load exercise library.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercisesList();
  }, [category, muscleGroup, difficulty, equipment, videosOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExercisesList();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMuscleGroup('All');
    setDifficulty('All');
    setEquipment('All');
    setVideosOnly(false);
  };

  const handleCreateCustom = async (e) => {
    e.preventDefault();
    if (!customForm.name.trim()) {
      notify('Exercise name is required.', 'error');
      return;
    }

    try {
      const payload = {
        ...customForm,
        instructions: customForm.instructions
          ? customForm.instructions.split('\n').filter((s) => s.trim())
          : [],
      };

      await createCustomExercise(payload);
      notify('Custom exercise added with video to your library!', 'success');
      setCustomModalOpen(false);
      setCustomForm({
        name: '',
        category: 'Strength',
        muscleGroup: 'Chest',
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        videoUrl: '',
        description: '',
        instructions: '',
      });
      fetchExercisesList();
    } catch (err) {
      notify(err.response?.data?.message || 'Error creating custom exercise.', 'error');
    }
  };

  const muscleGroups = [
    { label: 'All Muscles', value: 'All' },
    { label: 'Chest', value: 'Chest' },
    { label: 'Back', value: 'Back' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Shoulders', value: 'Shoulders' },
    { label: 'Arms', value: 'Arms' },
    { label: 'Core', value: 'Core' },
    { label: 'Cardio', value: 'Cardio' },
  ];

  const categories = ['All', 'Strength', 'Bodyweight', 'Core', 'Cardio', 'HIIT'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const equipmentList = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'];

  // Helper to get fallback thumbnail if needed
  const getThumbnail = (ex) => {
    if (ex.thumbnailUrl) return ex.thumbnailUrl;
    if (ex.youtubeId) return `https://img.youtube.com/vi/${ex.youtubeId}/hqdefault.jpg`;
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto page-transition">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden animate-fade-up card-shine">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />

        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Video className="w-3.5 h-3.5" />
            <span>Interactive Gym Video Guides</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Gym Exercise Library & Video Tutorials
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Watch HD gym workout tutorials directly inside FitMate AI. Master lifting mechanics, 
            progressive overload, and proper biomechanics for every major muscle group.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCustomModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Exercise</span>
          </button>
        </div>
      </div>

      {/* Body Part Filter Buttons */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Target Body Part:
          </span>
          <span className="text-slate-400 font-normal lowercase">
            {exercises.length} exercise{exercises.length === 1 ? '' : 's'} found
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {muscleGroups.map((m) => {
            const isActive = muscleGroup === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMuscleGroup(m.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises by name, equipment, muscle, or description..."
            className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {/* Multi-Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Equipment:</span>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {equipmentList.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Videos Only Toggle */}
          <button
            type="button"
            onClick={() => setVideosOnly(!videosOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold border transition-all ${
              videosOnly
                ? 'bg-red-50 text-red-700 border-red-200 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Video className={`w-3.5 h-3.5 ${videosOnly ? 'text-red-600' : 'text-slate-500'}`} />
            <span>Has Video Guide</span>
          </button>

          {(search || category !== 'All' || muscleGroup !== 'All' || difficulty !== 'All' || equipment !== 'All' || videosOnly) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 ml-auto font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      {loading ? (
        <LoadingSpinner size="md" text="Loading exercise tutorials..." />
      ) : exercises.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No exercises matched your filters"
          description="Try selecting a different body part or clearing your search filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => {
            const thumbnail = getThumbnail(exercise);
            const hasVideo = Boolean(exercise.youtubeId);

            return (
              <div
                key={exercise._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-emerald-300 card-hover-lift card-shine animate-fade-up flex flex-col justify-between overflow-hidden group"
                style={{ animationDelay: `${(index % 6) * 60}ms` }}
              >
                {/* Video Thumbnail Header */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (hasVideo) {
                      setVideoModalExercise(exercise);
                    } else {
                      setSelectedExercise(exercise);
                    }
                  }}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-800 to-slate-900 text-slate-400">
                      <Dumbbell className="w-10 h-10 text-slate-600 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-500">Exercise Demonstration</span>
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Play Button Overlay (when video exists) */}
                  {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 backdrop-blur-md group-hover:scale-125 group-hover:bg-emerald-400 group-hover:shadow-emerald-500/50 transition-all duration-300">
                        <Play className="w-6 h-6 fill-white ml-0.5 text-white animate-bounce-subtle" />
                      </div>
                    </div>
                  )}

                  {/* Muscle Badge at Top Left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-emerald-400 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                      {exercise.muscleGroup}
                    </span>
                  </div>

                  {/* Video Badge at Top Right */}
                  {hasVideo && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>Video</span>
                    </div>
                  )}

                  {/* Equipment at Bottom Left */}
                  <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-slate-200 drop-shadow-md">
                    {exercise.equipment} • {exercise.difficulty}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => setSelectedExercise(exercise)}
                      className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 mb-1.5"
                    >
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {exercise.description || 'Guided exercise tutorial with step-by-step form cues.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {hasVideo ? (
                      <button
                        onClick={() => setVideoModalExercise(exercise)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch Inside Website</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedExercise(exercise)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <span>View Instructions</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedExercise(exercise)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200/80 transition-colors"
                      title="Read form cues & instructions"
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
      {/* 🎬 DEDICATED IN-WEBSITE YOUTUBE VIDEO PLAYER MODAL       */}
      {/* ======================================================== */}
      {videoModalExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {videoModalExercise.name} — Video Demonstration
                  </h3>
                  <p className="text-xs text-slate-400">
                    {videoModalExercise.category} • {videoModalExercise.muscleGroup} • {videoModalExercise.equipment}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setVideoModalExercise(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Responsive YouTube Player */}
            <div className="relative aspect-video w-full bg-black shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoModalExercise.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={`${videoModalExercise.name} - FitMate AI Exercise Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Details & Form Cues Accordion */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    {videoModalExercise.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold">
                    Target: {videoModalExercise.muscleGroup}
                  </span>
                </div>

                {videoModalExercise.videoTitle && (
                  <span className="text-xs text-slate-500 font-medium italic">
                    Clip: {videoModalExercise.videoTitle}
                  </span>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Key Form Instructions & Cues
                </h4>
                {videoModalExercise.instructions && videoModalExercise.instructions.length > 0 ? (
                  <ol className="space-y-2 pt-1">
                    {videoModalExercise.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-xs text-slate-600">{videoModalExercise.description}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setVideoModalExercise(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📖 EXERCISE DETAIL MODAL                                 */}
      {/* ======================================================== */}
      <Modal
        isOpen={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        title={selectedExercise?.name}
        subtitle={`${selectedExercise?.category} • ${selectedExercise?.muscleGroup}`}
      >
        {selectedExercise && (
          <div className="space-y-5">
            {/* If has video, embed video right here too! */}
            {selectedExercise.youtubeId && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedExercise.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                  title={`${selectedExercise.name} Form Guide`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                {selectedExercise.difficulty}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                Equipment: {selectedExercise.equipment}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Overview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedExercise.description}
              </p>
            </div>

            {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Instructions & Form Cues
                </h4>
                <ol className="space-y-2">
                  {selectedExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* ➕ CREATE CUSTOM EXERCISE MODAL (WITH YOUTUBE VIDEO LINK) */}
      {/* ======================================================== */}
      <Modal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        title="Create Custom Exercise"
        subtitle="Add custom movements with YouTube video guides that play inside the website"
      >
        <form onSubmit={handleCreateCustom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Exercise Name *
            </label>
            <input
              type="text"
              required
              value={customForm.name}
              onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              placeholder="e.g. Incline Cable Pec Fly"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span>YouTube Video URL or ID (Plays inside website)</span>
            </label>
            <input
              type="text"
              value={customForm.videoUrl}
              onChange={(e) => setCustomForm({ ...customForm, videoUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Paste any YouTube video link. FitMate AI automatically embeds and plays it inside your website.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={customForm.category}
                onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Bodyweight">Bodyweight</option>
                <option value="Core">Core</option>
                <option value="HIIT">HIIT</option>
                <option value="Flexibility">Flexibility</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Target Muscle
              </label>
              <select
                value={customForm.muscleGroup}
                onChange={(e) => setCustomForm({ ...customForm, muscleGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Arms">Arms</option>
                <option value="Core">Core</option>
                <option value="Full Body">Full Body</option>
                <option value="Cardio">Cardio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Equipment
              </label>
              <select
                value={customForm.equipment}
                onChange={(e) => setCustomForm({ ...customForm, equipment: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Dumbbell">Dumbbell</option>
                <option value="Barbell">Barbell</option>
                <option value="Bodyweight">Bodyweight</option>
                <option value="Machine">Machine</option>
                <option value="Cable">Cable</option>
                <option value="Kettlebell">Kettlebell</option>
                <option value="Bands">Bands</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Difficulty
              </label>
              <select
                value={customForm.difficulty}
                onChange={(e) => setCustomForm({ ...customForm, difficulty: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={customForm.description}
              onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
              placeholder="e.g. Unilateral quad and glute builder..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Instructions (One cue per line)
            </label>
            <textarea
              rows="3"
              value={customForm.instructions}
              onChange={(e) => setCustomForm({ ...customForm, instructions: e.target.value })}
              placeholder="Set up bench&#10;Keep elbows locked at 45 degrees&#10;Squeeze pecs at the peak contraction"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCustomModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs"
            >
              Save Exercise
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
