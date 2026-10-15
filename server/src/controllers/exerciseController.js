import { Exercise } from '../models/Exercise.js';

/**
 * Extracts 11-character YouTube video ID from various YouTube URL formats
 */
export const extractYoutubeId = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : '';
};

// @desc    Get exercises with search and filters
// @route   GET /api/exercises
// @access  Public or Authenticated
export const getExercises = async (req, res, next) => {
  try {
    const { search, category, muscleGroup, difficulty, equipment, hasVideo } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (muscleGroup && muscleGroup !== 'All') {
      query.muscleGroup = muscleGroup;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (equipment && equipment !== 'All') {
      query.equipment = equipment;
    }

    if (hasVideo === 'true') {
      query.youtubeId = { $exists: true, $ne: '' };
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { muscleGroup: { $regex: search.trim(), $options: 'i' } },
        { equipment: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const exercises = await Exercise.find(query).sort({ muscleGroup: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Public or Authenticated
export const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create custom exercise
// @route   POST /api/exercises
// @access  Private
export const createCustomExercise = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      muscleGroup,
      equipment,
      difficulty,
      instructions,
      videoUrl,
      videoTitle,
    } = req.body;

    if (!name || !category || !muscleGroup) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exercise name, category, and muscle group.',
      });
    }

    const youtubeId = extractYoutubeId(videoUrl);
    const resolvedVideoUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : (videoUrl || '');
    const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '';

    const exercise = await Exercise.create({
      name: name.trim(),
      category,
      description: description || '',
      muscleGroup,
      equipment: equipment || 'Bodyweight',
      difficulty: difficulty || 'Beginner',
      instructions: Array.isArray(instructions)
        ? instructions
        : instructions
        ? [instructions]
        : [],
      youtubeId,
      videoUrl: resolvedVideoUrl,
      thumbnailUrl,
      videoTitle: videoTitle || `${name.trim()} Demonstration`,
      isCustom: true,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Custom exercise created successfully!',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};
