import { Goal } from '../models/Goal.js';
import { WorkoutCompletion } from '../models/WorkoutCompletion.js';

// @desc    Get all user goals with optional status filter
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const goals = await Goal.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single goal by ID
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { title, category, description, targetValue, currentProgress, unit, startDate, targetDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Goal title is required.',
      });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      category: category || 'general_fitness',
      description: description || '',
      targetValue: targetValue !== undefined && targetValue !== '' ? Number(targetValue) : null,
      currentProgress: currentProgress ? Number(currentProgress) : 0,
      unit: unit || '',
      startDate: startDate || new Date(),
      targetDate: targetDate || null,
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Fitness goal created successfully!',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found or access denied.',
      });
    }

    const { title, category, description, targetValue, currentProgress, unit, startDate, targetDate, status } = req.body;

    if (title !== undefined) goal.title = title.trim();
    if (category !== undefined) goal.category = category;
    if (description !== undefined) goal.description = description;
    if (targetValue !== undefined) goal.targetValue = targetValue === '' ? null : Number(targetValue);
    if (currentProgress !== undefined) goal.currentProgress = Number(currentProgress);
    if (unit !== undefined) goal.unit = unit;
    if (startDate !== undefined) goal.startDate = startDate;
    if (targetDate !== undefined) goal.targetDate = targetDate === '' ? null : targetDate;
    if (status !== undefined) goal.status = status;

    // Check completion criteria if numeric
    if (goal.targetValue !== null && goal.currentProgress !== null && goal.targetValue > 0) {
      if (goal.currentProgress >= goal.targetValue && goal.status === 'active') {
        goal.status = 'completed';
      }
    }

    await goal.save();

    return res.status(200).json({
      success: true,
      message: 'Goal updated successfully!',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync goal progress based on actual recorded workouts
// @route   POST /api/goals/:id/sync
// @access  Private
export const syncGoalProgress = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }

    if (goal.category === 'workout_frequency' || goal.category === 'exercise_consistency') {
      // Calculate completions since startDate
      const start = goal.startDate || new Date(0);
      const count = await WorkoutCompletion.countDocuments({
        user: req.user._id,
        completionDate: { $gte: start },
      });

      goal.currentProgress = count;
      if (goal.targetValue && count >= goal.targetValue) {
        goal.status = 'completed';
      }
      await goal.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Goal progress synchronized from real workout records.',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};
