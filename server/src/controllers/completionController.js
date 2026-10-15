import { WorkoutCompletion } from '../models/WorkoutCompletion.js';
import { WorkoutSchedule } from '../models/WorkoutSchedule.js';
import { Workout } from '../models/Workout.js';
import { Goal } from '../models/Goal.js';

// @desc    Get all workout completions for user
// @route   GET /api/workout-completions
// @access  Private
export const getWorkoutCompletions = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;

    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.completionDate = {};
      if (startDate) query.completionDate.$gte = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      if (endDate) query.completionDate.$lte = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    }

    const completions = await WorkoutCompletion.find(query)
      .populate('workout')
      .sort({ completionDate: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: completions.length,
      data: completions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout completion by ID
// @route   GET /api/workout-completions/:id
// @access  Private
export const getWorkoutCompletionById = async (req, res, next) => {
  try {
    const completion = await WorkoutCompletion.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('workout');

    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'Completion record not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: completion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a workout completion
// @route   POST /api/workout-completions
// @access  Private
export const createWorkoutCompletion = async (req, res, next) => {
  try {
    const {
      workoutId,
      workoutName,
      completionDate,
      durationMinutes,
      caloriesBurned,
      exercisesCompleted,
      notes,
      scheduleId,
    } = req.body;

    let finalWorkoutName = workoutName;

    // If workoutId provided, verify ownership and get name
    if (workoutId) {
      const routine = await Workout.findOne({ _id: workoutId, user: req.user._id });
      if (!routine) {
        return res.status(404).json({
          success: false,
          message: 'Referenced workout routine not found or not owned by user.',
        });
      }
      if (!finalWorkoutName) {
        finalWorkoutName = routine.name;
      }
    }

    if (!finalWorkoutName) {
      return res.status(400).json({
        success: false,
        message: 'Workout name is required.',
      });
    }

    if (!durationMinutes || Number(durationMinutes) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Recorded duration in minutes is required.',
      });
    }

    const completion = await WorkoutCompletion.create({
      user: req.user._id,
      workout: workoutId || null,
      workoutName: finalWorkoutName,
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      durationMinutes: Number(durationMinutes),
      caloriesBurned: caloriesBurned ? Number(caloriesBurned) : null,
      exercisesCompleted: exercisesCompleted || [],
      notes: notes || '',
      scheduleId: scheduleId || null,
    });

    // If linked to a scheduled session, update schedule status
    if (scheduleId) {
      await WorkoutSchedule.findOneAndUpdate(
        { _id: scheduleId, user: req.user._id },
        { status: 'completed', completion: completion._id }
      );
    }

    // Auto update active frequency goals for user
    try {
      const activeGoals = await Goal.find({
        user: req.user._id,
        category: { $in: ['workout_frequency', 'exercise_consistency'] },
        status: 'active',
      });

      for (const goal of activeGoals) {
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
    } catch (goalErr) {
      console.error('[Goal Update Error]', goalErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Workout completion recorded successfully! Great job staying active.',
      data: completion,
    });
  } catch (error) {
    next(error);
  }
};
