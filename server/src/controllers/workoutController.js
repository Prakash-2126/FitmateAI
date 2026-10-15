import { Workout } from '../models/Workout.js';

// @desc    Get all workout routines for authenticated user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .populate('exercises.exercise')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout routine by ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id })
      .populate('exercises.exercise');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout routine not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new workout routine
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    const { name, description, workoutType, estimatedDuration, exercises } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Workout routine name is required.',
      });
    }

    const formattedExercises = (exercises || []).map((item, idx) => ({
      exercise: item.exercise || null,
      name: item.name || 'Exercise',
      sets: item.sets ? Number(item.sets) : 3,
      reps: item.reps ? Number(item.reps) : 10,
      weight: item.weight !== undefined && item.weight !== '' ? Number(item.weight) : null,
      duration: item.duration !== undefined && item.duration !== '' ? Number(item.duration) : null,
      restInterval: item.restInterval ? Number(item.restInterval) : 60,
      order: item.order !== undefined ? Number(item.order) : idx,
    }));

    const workout = await Workout.create({
      user: req.user._id,
      name: name.trim(),
      description: description || '',
      workoutType: workoutType || 'Strength',
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : 45,
      exercises: formattedExercises,
    });

    return res.status(201).json({
      success: true,
      message: 'Workout routine created successfully!',
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a workout routine
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout routine not found or access denied.',
      });
    }

    const { name, description, workoutType, estimatedDuration, exercises } = req.body;

    if (name !== undefined) workout.name = name.trim();
    if (description !== undefined) workout.description = description;
    if (workoutType !== undefined) workout.workoutType = workoutType;
    if (estimatedDuration !== undefined) workout.estimatedDuration = Number(estimatedDuration);

    if (exercises !== undefined && Array.isArray(exercises)) {
      workout.exercises = exercises.map((item, idx) => ({
        exercise: item.exercise || null,
        name: item.name || 'Exercise',
        sets: item.sets ? Number(item.sets) : 3,
        reps: item.reps ? Number(item.reps) : 10,
        weight: item.weight !== undefined && item.weight !== '' ? Number(item.weight) : null,
        duration: item.duration !== undefined && item.duration !== '' ? Number(item.duration) : null,
        restInterval: item.restInterval ? Number(item.restInterval) : 60,
        order: item.order !== undefined ? Number(item.order) : idx,
      }));
    }

    await workout.save();

    return res.status(200).json({
      success: true,
      message: 'Workout routine updated successfully!',
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workout routine
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout routine not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Workout routine deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
